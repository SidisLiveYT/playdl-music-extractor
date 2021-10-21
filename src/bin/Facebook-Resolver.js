const FacebookParser = require('facebook-video-link');
const PlayDLExtractor = require('./Track-Extractor');

async function FacebookExtractor(
  Url,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
  } || undefined,
  StreamDownloadBoolenRecord = null,
) {
  const FacebookData = await FacebookParser(Url);
  return {
    playlist: false,
    tracks: await PlayDLExtractor.DataExtractorYoutube(
      (FacebookData && FacebookData.title
        ? FacebookData.title.slice(0, 35)
        : null)
        ?? (FacebookData && FacebookData[0] && FacebookData[0].title
          ? FacebookData.title.slice(0, 35)
          : null)
        ?? null,
      'facebook',
      YoutubeStreamOptions,
      { stream: FacebookData.link },
      StreamDownloadBoolenRecord,
    ),
  };
}

module.exports = FacebookExtractor;
