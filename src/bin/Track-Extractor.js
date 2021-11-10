const {
  search, validate, stream, setToken,
} = require('play-dl');
const { randomOne } = require('proxies-generator');

class PlayDLExtractor {
  static #YoutubeCookies = undefined;

  static async DataExtractorYoutube(
    Query,
    extractor = undefined,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Cookies: undefined,
      Proxy: undefined,
    },
    ExtraValue = {},
    StreamDownloadBoolenRecord = undefined,
  ) {
    if (
      YoutubeStreamOptions
      && YoutubeStreamOptions.Cookies
      && PlayDLExtractor.#YoutubeCookies !== YoutubeStreamOptions.Cookies
    ) {
      PlayDLExtractor.#YoutubeCookies = YoutubeStreamOptions.Cookies;
      setToken({
        youtube: {
          cookie: PlayDLExtractor.#YoutubeCookies,
        },
      });
    }
    let PlayDLSearchResults = await search(Query, {
      limit:
        validate(Query) === 'yt_playlist' ? 100 : YoutubeStreamOptions.Limit,
      source:
        (validate(Query) === 'yt_playlist'
          ? { youtube: 'playlist' }
          : undefined)
        ?? (validate(Query) === 'yt_video' ? { youtube: 'video' } : undefined)
        ?? undefined,
    });
    PlayDLSearchResults = PlayDLSearchResults.filter(Boolean);
    const CacheData = await Promise.all(
      PlayDLSearchResults.map(
        async (Video) => await PlayDLExtractor.#YoutubeTrackModel(
          Video,
          extractor,
          YoutubeStreamOptions,
          ExtraValue ?? {},
          StreamDownloadBoolenRecord,
        ),
      ),
    );
    return CacheData;
  }

  static async #streamdownloader(
    url,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    },
    Loop = 0,
  ) {
    try {
      const StreamSource = await stream(
        url,
        YoutubeStreamOptions
          ? {
            quality:
                (YoutubeStreamOptions
                && YoutubeStreamOptions.Quality
                && YoutubeStreamOptions.Quality.includes('low')
                  ? 0
                  : undefined)
                ?? (YoutubeStreamOptions
                && YoutubeStreamOptions.Quality
                && YoutubeStreamOptions.Quality.includes('medium')
                  ? 1
                  : undefined)
                ?? undefined,
            proxy:
                (YoutubeStreamOptions.Proxy
                  ? [YoutubeStreamOptions.Proxy]
                  : undefined) ?? undefined,
          }
          : undefined,
      );
      return StreamSource;
    } catch (error) {
      if (
        Loop >= 10
        || !(
          `${error.message}`.includes('429')
          || `${error.message}`.includes('Ratelimit')
          || `${error.message}`.includes('ratelimit')
          || `${error.message}`.includes('unavailable')
        )
        || !(
          `${error}`.includes('429')
          || `${error}`.includes('Ratelimit')
          || `${error}`.includes('ratelimit')
          || `${error}`.includes('unavailable')
        )
      ) throw Error(`${error.message}`);
      YoutubeStreamOptions.Proxy = [(await randomOne(true)).url];
      const StreamData = await PlayDLExtractor.#streamdownloader(
        url,
        YoutubeStreamOptions,
        ++Loop,
      );
      if (Loop !== 0) return StreamData;

      return {
        streamdatas: StreamData,
        error: `${error.message}` ?? `${error}`,
      };
    }
  }

  static async #YoutubeTrackModel(
    YoutubeVideoRawData,
    extractor = undefined,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    },
    ExtraValue = {},
    StreamDownloadBoolenRecord = undefined,
  ) {
    let SourceStream = StreamDownloadBoolenRecord
      ? await PlayDLExtractor.#streamdownloader(
        YoutubeVideoRawData.url ?? undefined,
        YoutubeStreamOptions,
      )
      : undefined;
    const ErrorData = SourceStream && SourceStream.error ? SourceStream.error : undefined;
    SourceStream = SourceStream && SourceStream.streamdatas
      ? SourceStream.streamdatas
      : SourceStream;
    const track = {
      Id: 0,
      url: ExtraValue.url ?? YoutubeVideoRawData.url ?? undefined,
      video_Id: ExtraValue.video_Id ?? YoutubeVideoRawData.id ?? undefined,
      title: ExtraValue.title ?? YoutubeVideoRawData.title ?? undefined,
      author:
        ExtraValue.author
        ?? (YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.name
          : undefined)
        ?? undefined,
      author_link:
        ExtraValue.author_link
        ?? (YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.url
          : undefined)
        ?? undefined,
      description:
        ExtraValue.description ?? YoutubeVideoRawData.description ?? undefined,
      custom_extractor: 'play-dl',
      duration:
        (ExtraValue.is_live || YoutubeVideoRawData.live
          ? 0
          : ExtraValue.duration)
        ?? (YoutubeVideoRawData.durationInSec ?? 0) * 1000,
      human_duration: PlayDLExtractor.HumanTimeConversion(
        (ExtraValue.is_live || YoutubeVideoRawData.live
          ? 0
          : ExtraValue.duration)
          ?? (YoutubeVideoRawData.durationInSec ?? 0) * 1000,
      ),
      stream: StreamDownloadBoolenRecord
        ? ExtraValue.stream
          ?? (SourceStream ? SourceStream.stream : undefined)
          ?? undefined
        : undefined,
      stream_type: StreamDownloadBoolenRecord
        ? (SourceStream ? SourceStream.type : undefined) ?? undefined
        : undefined,
      stream_duration: StreamDownloadBoolenRecord
        ? ExtraValue.is_live || YoutubeVideoRawData.live
          ? 0
          : YoutubeVideoRawData.durationInSec * 1000
        : undefined,
      stream_video_Id:
        YoutubeVideoRawData.id ?? ExtraValue.video_Id ?? undefined,
      stream_human_duration: StreamDownloadBoolenRecord
        ? PlayDLExtractor.HumanTimeConversion(
          ExtraValue.is_live || YoutubeVideoRawData.live
            ? 0
            : (YoutubeVideoRawData.durationInSec ?? 0) * 1000,
        )
        : undefined,
      orignal_extractor: extractor ?? 'youtube',
      thumbnail:
        ExtraValue.thumbnail
        ?? (YoutubeVideoRawData.thumbnail
          ? YoutubeVideoRawData.thumbnail.url
          : undefined)
        ?? undefined,
      channelId:
        (ExtraValue.author ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.id
          : undefined) ?? undefined,
      channel_url:
        (ExtraValue.author_link ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.url
          : undefined) ?? undefined,
      likes: ExtraValue.likes ?? YoutubeVideoRawData.likes ?? 0,
      is_live: ExtraValue.is_live ?? YoutubeVideoRawData.live ?? false,
      dislikes: ExtraValue.dislikes ?? YoutubeVideoRawData.dislikes ?? 0,
    };
    if (ErrorData) {
      return {
        track,
        error: ErrorData,
      };
    }
    return track;
  }

  static HumanTimeConversion(DurationMilliSeconds = 0) {
    if (typeof DurationMilliSeconds !== 'number') return void null;
    DurationMilliSeconds /= 1000;
    let ProcessedString = '';
    for (
      let DurationArray = [
          [Math.floor(DurationMilliSeconds / 31536e3), 'Years'],
          [Math.floor((DurationMilliSeconds % 31536e3) / 86400), 'Days'],
          [
            Math.floor(((DurationMilliSeconds % 31536e3) % 86400) / 3600),
            'Hours',
          ],
          [
            Math.floor(
              (((DurationMilliSeconds % 31536e3) % 86400) % 3600) / 60,
            ),
            'Minutes',
          ],
          [
            Math.floor(
              (((DurationMilliSeconds % 31536e3) % 86400) % 3600) % 60,
            ),
            'Seconds',
          ],
        ],
        SideArray = 0,
        GarbageValue = DurationArray.length;
      SideArray < GarbageValue;
      SideArray++
    ) {
      DurationArray[SideArray][0] !== 0
        && (ProcessedString += ` ${DurationArray[SideArray][0]} ${
          DurationArray[SideArray][0] === 1
            ? DurationArray[SideArray][1].substr(
              0,
              DurationArray[SideArray][1].length - 1,
            )
            : DurationArray[SideArray][1]
        }`);
    }
    return ProcessedString.trim();
  }
}

module.exports = PlayDLExtractor;
