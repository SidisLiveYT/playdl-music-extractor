const { search, validate, stream } = require('play-dl');

class PlayDLExtractor {
  static async DataExtractorYoutube(
    Query,
    extractor = null,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    },
    ExtraValue = {},
    StreamDownloadBoolenRecord = null,
  ) {
    try {
      const PlayDLSearchResults = await search(Query, {
        limit:
          validate(Query) === 'yt_playlist' ? 100 : YoutubeStreamOptions.Limit,
        source:
          (validate(Query) === 'yt_playlist'
            ? { youtube: 'playlist' }
            : null)
          ?? (validate(Query) === 'yt_video' ? { youtube: 'video' } : undefined)
          ?? undefined,
      });
      const CacheData = await Promise.all(
        PlayDLSearchResults.map(
          async (Video) => await PlayDLExtractor.#YoutubeTrackModel(
            Video,
            extractor,
            YoutubeStreamOptions,
            ExtraValue,
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
                : null)
              ?? (YoutubeStreamOptions
              && YoutubeStreamOptions.Quality
              && YoutubeStreamOptions.Quality.includes('medium')
                ? 1
                : undefined)
              ?? undefined,
          proxy:
              (YoutubeStreamOptions.Proxy
                ? [YoutubeStreamOptions.Proxy]
                : null) ?? undefined,
        }
        : undefined,
    );
    return StreamSource;
  }

  static async #YoutubeTrackModel(
    YoutubeVideoRawData,
    extractor = null,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    },
    ExtraValue = {},
    StreamDownloadBoolenRecord = null,
  ) {
    const SourceStream = StreamDownloadBoolenRecord
      ? await PlayDLExtractor.#streamdownloader(
        YoutubeVideoRawData.url ?? null,
        YoutubeStreamOptions,
      )
      : null;
    const track = {
      Id: 0,
      url: ExtraValue.url ?? YoutubeVideoRawData.url ?? null,
      title: ExtraValue.title ?? YoutubeVideoRawData.title ?? null,
      author:
        ExtraValue.author ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.name
          : null ?? null,
      author_link:
        ExtraValue.author_link ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.url
          : null ?? null,
      description:
        ExtraValue.description ?? YoutubeVideoRawData.description ?? null,
      custom_extractor: 'play-dl',
      duration: ExtraValue.duration ?? YoutubeVideoRawData.durationInSec ?? 0,
      stream:
        ExtraValue.stream
        ?? (SourceStream ? SourceStream.stream : null)
        ?? null,
      stream_type: (SourceStream ? SourceStream.type : null) ?? undefined,
      orignal_extractor: extractor ?? 'youtube',
      thumbnail:
        ExtraValue.thumbnail ?? YoutubeVideoRawData.thumbnail
          ? YoutubeVideoRawData.thumbnail.url
          : null ?? null,
      channelId:
        ExtraValue.author ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.id
          : null ?? null,
      channel_url:
        ExtraValue.author_link ?? YoutubeVideoRawData.channel
          ? YoutubeVideoRawData.channel.url
          : null ?? null,
      likes: ExtraValue.likes ?? YoutubeVideoRawData.likes ?? 0,
      is_live: ExtraValue.is_live ?? YoutubeVideoRawData.live ?? false,
      dislikes: ExtraValue.dislikes ?? YoutubeVideoRawData.dislikes ?? 0,
    };
    return track;
  }
}

module.exports = PlayDLExtractor;
