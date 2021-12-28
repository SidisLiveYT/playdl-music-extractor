const ReverbnationParser = require('reverbnation-scraper');
const PlayDLExtractor = require('./Track-Extractor');

async function ReverbnationExtractor(
  Url,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Cookies: undefined,
    UserAgents: undefined,
  } || undefined,
  StreamDownloadBoolenRecord = undefined,
) {
  try {
    const ReverbnationData = await ReverbnationParser.getInfo(Url);
    return {
      playlist: false,
      tracks: await PlayDLExtractor.DataExtractorYoutube(
        (ReverbnationData && ReverbnationData.title
          ? ReverbnationData.title.slice(0, 35)
          : undefined)
          ?? (ReverbnationData && ReverbnationData[0] && ReverbnationData[0].title
            ? ReverbnationData.title.slice(0, 35)
            : undefined)
          ?? undefined,
        'reverbnation',
        YoutubeStreamOptions,
        {
          stream:
            ReverbnationData
            && ReverbnationData.songs
            && ReverbnationData.songs[0]
              ? ReverbnationData.songs[0].streamURL
              : undefined,
        },
        StreamDownloadBoolenRecord,
      ),
      error: undefined,
    };
  } catch (error) {
    return {
      playlist: false,
      tracks: [],
      error,
    };
  }
}

module.exports = ReverbnationExtractor;
