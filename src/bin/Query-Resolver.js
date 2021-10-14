const { validate } = require('play-dl');
const UriCheck = require('is-url');
const PlayDLExtractor = require('./Track-Extractor');

async function QueryResolver(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
  },
) {
  const ValidateUrlResult = await validate(Query);
  if (
    UriCheck(Query)
    && (!ValidateUrlResult
      || (ValidateUrlResult && ValidateUrlResult.includes('search')))
  ) {
    return {
      playlist: false,
      tracks: [],
    };
  }
  const YoutubeTracks = {
    playlist:
      !ValidateUrlResult
      ?? ValidateUrlResult.includes('playlist')
      ?? ValidateUrlResult.includes('album')
      ?? false,
    tracks: await PlayDLExtractor.DataExtractorYoutube(
      Query,
      'youtube',
      YoutubeStreamOptions,
    ),
  };
  return YoutubeTracks;
}

module.exports = QueryResolver;
