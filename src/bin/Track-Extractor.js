const YTDLCoreExtractor = require('ytdl-core');
const { search, validate } = require('play-dl');

async function DataExtractorYoutube(
  Query,
  extractor = false,
  YoutubeDownloadOptions = {
    Limit: 1,
    Cookies: undefined,
    Proxy: undefined,
    HighWaterMark: 25 >> 5,
    BufferTimeout: 20 * 1000,
    Quality: 'highestaudio',
    Filter: 'audioandvideo',
  } || undefined,
  ExtraValue = {},
) {
  try {
    const PlayDLSearchResults = await search(Query, {
      limit: validate(Query) === 'yt_playlist' ? 100 : Limit ?? 1,
      source:
        validate(Query) === 'yt_playlist'
          ? { youtube: 'playlist' }
          : validate(Query) === 'yt_video'
            ? { youtube: 'video' }
            : undefined,
    });
    if (validate(Query) === 'yt_playlist') {

    }
    const YoutubeRawDatas = YTDLCoreExtractor.getInfo(Query, {
      requestOptions: YoutubeDownloadOptions.Cookies
        ? {
          headers: {
            cookie: YoutubeDownloadOptions.Cookies,
          },
        }
        : ProxyAgent
          ? { ProxyAgent }
          : undefined,
      highWaterMark: YoutubeDownloadOptions.HighWaterMark,
      liveBuffer: YoutubeDownloadOptions.BufferTimeout,
      quality: YoutubeDownloadOptions.Quality,
      filter: YoutubeDownloadOptions.Filter,
    });
  } catch (error) {
    return void null;
  }

  function YoutubeTrackModel(
    YoutubeRawData,
    extractor = false,
    ExtraValue = {},
  ) {
    const track = {
      Id: 0,
      url:
        ExtraValue.url
        ?? YoutubeRawData.webpage_url
        ?? YoutubeRawData.entries[0].webpage_url
        ?? YoutubeRawData.video_url
        ?? null,
      title:
        ExtraValue.title
        ?? YoutubeRawData.track
        ?? YoutubeRawData.title
        ?? YoutubeRawData.entries[0].title
        ?? null,
      author:
        ExtraValue.author
        ?? YoutubeRawData.uploader
        ?? YoutubeRawData.channel
        ?? YoutubeRawData.entries[0].creator
        ?? YoutubeRawData.entries[0].uploader
        ?? null,
      author_link:
        ExtraValue.author_link
        ?? YoutubeRawData.uploader_url
        ?? YoutubeRawData.entries[0].uploader_url
        ?? YoutubeRawData.channel_url
        ?? YoutubeRawData.entries[0].channel_url
        ?? null,
      description:
        ExtraValue.description
        ?? YoutubeRawData.description
        ?? YoutubeRawData.entries[0].description
        ?? null,
      custom_extractor: 'youtube-dl',
      duration:
        ExtraValue.duration
        ?? YoutubeRawData.duration
        ?? YoutubeRawData.entries[0].duration
        ?? 0,
      stream_url:
        ExtraValue.stream_url
        ?? YoutubeRawData.url
        ?? YoutubeRawData.entries[0].formats.find((rqformat) => rqformat.format.includes('audio')).url
        ?? YoutubeRawData.entries[0].requested_formats.find((rqformat) => rqformat.format.includes('audio')).url
        ?? null,
      orignal_extractor:
        extractor
        ?? YoutubeRawData.extractor
        ?? YoutubeRawData.extractor_key
        ?? YoutubeRawData.entries[0].extractor
        ?? YoutubeRawData.entries[0].extractor_key
        ?? 'arbitary',
      thumbnail:
        ExtraValue.thumbnail
        ?? YoutubeRawData.thumbnail
        ?? YoutubeRawData.entries[0].thumbnail
        ?? YoutubeRawData.thumbnail[0].url
        ?? null,
      channelId:
        ExtraValue.channelId
        ?? YoutubeRawData.channel_id
        ?? YoutubeRawData.entries[0].channel_id
        ?? null,
      channel_url:
        ExtraValue.channel_url
        ?? YoutubeRawData.channel_url
        ?? YoutubeRawData.entries[0].channel_url
        ?? null,
      likes:
        ExtraValue.likes
        ?? YoutubeRawData.like_count
        ?? YoutubeRawData.entries[0].like_count
        ?? 0,
      is_live:
        ExtraValue.is_live
        ?? YoutubeRawData.is_live
        ?? YoutubeRawData.entries[0].is_live
        ?? false,
      dislikes:
        ExtraValue.dislikes
        ?? YoutubeRawData.like_count
        ?? YoutubeRawData.entries[0].dislike_count
        ?? 0,
    };
    return track;
  }
}

module.exports = DataExtractorYoutube;
