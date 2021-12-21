const FacebookParser = require('facebook-video-link');
const PlayDLExtractor = require('./Track-Extractor');

async function FacebookExtractor(
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
    const FacebookData = await FacebookParser(Url);
    return {
      playlist: false,
      tracks: await PlayDLExtractor.DataExtractorYoutube(
        (FacebookData && FacebookData.title
          ? FacebookData.title.slice(0, 35)
          : undefined)
          ?? (FacebookData && FacebookData[0] && FacebookData[0].title
            ? FacebookData.title.slice(0, 35)
            : undefined)
          ?? undefined,
        'facebook',
        YoutubeStreamOptions,
        { stream: FacebookData.link },
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

module.exports = FacebookExtractor;
