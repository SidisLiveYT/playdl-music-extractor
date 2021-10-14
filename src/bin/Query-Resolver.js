const { validate } = require('play-dl');
const YTDLExtractor = require('./Track-Extractor');

async function QueryResolver(Query) {
  const YoutubeUrlRegex = /^.*(youtu.be\/|list=|watch=|v=)([^#\&\?]*).*/;
  const ValidateUrlResult = await validate(Query);
  const YoutubeTracks = {
    playlist:
      !ValidateUrlResult
      ?? ValidateUrlResult.includes('playlist')
      ?? ValidateUrlResult.includes('album')
      ?? false,
    tracks:
      Query.match(YoutubeUrlRegex)
      && ValidateUrlResult
      && (ValidateUrlResult.includes('playlist')
        || ValidateUrlResult.includes('album'))
        ? await YTDLExtractor(Query)
        : [await YTDLExtractor(Query)],
  };
  return YoutubeTracks;
}

module.exports = QueryResolver;
