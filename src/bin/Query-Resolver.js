const { validate } = require('play-dl');
const UriCheck = require('is-url');
const PlayDLExtractor = require('./Track-Extractor');

async function QueryResolver(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Cookies: undefined,
    UserAgents: undefined,
    IgnoreError: false,
  },
  StreamDownloadBoolenRecord = undefined,
) {
  try {
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
        error: 'No Supported URL',
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
  } catch (error) {
    return {
      playlist: false,
      tracks: [],
      error,
    };
  }
}

module.exports = QueryResolver;
