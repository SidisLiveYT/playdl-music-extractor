const { validate } = require('play-dl');
const UriCheck = require('is-url');
const PlayDLExtractor = require('./Track-Extractor');

async function QueryResolver(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
    IgnoreError: false,
  },
  StreamDownloadBoolenRecord = undefined,
) {
  const ValidateUrlResult = await validate(Query);
  if (
    UriCheck(Query)
    && YoutubeStreamOptions.IgnoreError
    && (!ValidateUrlResult
      || (ValidateUrlResult && ValidateUrlResult.includes('search')))
  ) {
    return {
      playlist: false,
      tracks: [],
    };
  }
  if (
    UriCheck(Query)
    && (!ValidateUrlResult
      || (ValidateUrlResult && ValidateUrlResult.includes('search')))
  ) {
    throw Error('Invalid Query or Url for package is Detected');
  }
  const YoutubeTracks = {
    playlist:
      (!ValidateUrlResult
      || (ValidateUrlResult && ValidateUrlResult.includes('search'))
        ? false
        : undefined)
      ?? ValidateUrlResult.includes('playlist')
      ?? ValidateUrlResult.includes('album')
      ?? false,
    tracks: await PlayDLExtractor.DataExtractorYoutube(
      Query,
      'youtube',
      YoutubeStreamOptions,
      undefined,
      StreamDownloadBoolenRecord,
    ),
  };
  return YoutubeTracks;
}

module.exports = QueryResolver;
