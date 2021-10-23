const { search, validate, stream } = require('play-dl');

class PlayDLExtractor {
  static async DataExtractorYoutube(
    Query,
    extractor = undefined,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    },
    ExtraValue = {},
    StreamDownloadBoolenRecord = undefined,
  ) {
    try {
      const PlayDLSearchResults = await search(Query, {
        limit:
          validate(Query) === 'yt_playlist' ? 100 : YoutubeStreamOptions.Limit,
        source:
          (validate(Query) === 'yt_playlist'
            ? { youtube: 'playlist' }
            : undefined)
          ?? (validate(Query) === 'yt_video' ? { youtube: 'video' } : undefined)
          ?? undefined,
      });
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
    } catch (error) {
      return [];
    }
  }

  static async #streamdownloader(
    url,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    },
  ) {
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
    const SourceStream = StreamDownloadBoolenRecord
      ? await PlayDLExtractor.#streamdownloader(
        YoutubeVideoRawData.url ?? undefined,
        YoutubeStreamOptions,
      )
      : undefined;
    const track = {
      Id: 0,
      url: ExtraValue.url ?? YoutubeVideoRawData.url ?? undefined,
      title: ExtraValue.title ?? YoutubeVideoRawData.title ?? undefined,
      author:
        ExtraValue.author ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.name
          : undefined ?? undefined,
      author_link:
        ExtraValue.author_link ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.url
          : undefined ?? undefined,
      description:
        ExtraValue.description ?? YoutubeVideoRawData.description ?? undefined,
      custom_extractor: 'play-dl',
      duration: ExtraValue.duration ?? YoutubeVideoRawData.durationInSec ?? 0,
      stream: StreamDownloadBoolenRecord
        ? ExtraValue.stream
          ?? (SourceStream ? SourceStream.stream : undefined)
          ?? undefined
        : undefined,
      stream_type: StreamDownloadBoolenRecord
        ? (SourceStream ? SourceStream.type : undefined) ?? undefined
        : undefined,
      orignal_extractor: extractor ?? 'youtube',
      thumbnail:
        ExtraValue.thumbnail ?? YoutubeVideoRawData.thumbnail
          ? YoutubeVideoRawData.thumbnail.url
          : undefined ?? undefined,
      channelId:
        ExtraValue.author ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.id
          : undefined ?? undefined,
      channel_url:
        ExtraValue.author_link ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.url
          : undefined ?? undefined,
      likes: ExtraValue.likes ?? YoutubeVideoRawData.likes ?? 0,
      is_live: ExtraValue.is_live ?? YoutubeVideoRawData.live ?? false,
      dislikes: ExtraValue.dislikes ?? YoutubeVideoRawData.dislikes ?? 0,
    };
    return track;
  }
}

module.exports = PlayDLExtractor;
