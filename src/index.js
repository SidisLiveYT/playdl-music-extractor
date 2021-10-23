const SpotifyExtractor = require('./bin/Spotify-Resolver');
const QueryResolver = require('./bin/Query-Resolver');
const SoundCloudExtractor = require('./bin/SoundCloud-Resolver');
const YoutubeData = require('../typings/instances-commonjs');
const FacebookResolver = require('./bin/Facebook-Resolver');
const ReverbnationResolver = require('./bin/Reverbnation-Resolver');

/**
 * @function Extractor play-dl Extractor for Music Players Node.jsv16
 * @param {String} Query Query for Searching Data as Tracks , Playlist or albums
 * @param {Object} YoutubeStreamOptions Youtube Stream Options for play-dl
 * @returns {Promise<YoutubeData>} play-dlTracks
 */

async function Extractor(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
    IgnoreError: false,
  } || undefined,
) {
  const SpotifyUrlRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const SoundCloundUrlRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/;
  const FacebookVideoUrlRegex = /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/;
  if (!Query || (Query && typeof Query !== 'string')) throw TypeError('Query is invalid or is not String');
  if (Query.match(SpotifyUrlRegex)) return await SpotifyExtractor(Query, YoutubeStreamOptions);
  if (Query.match(FacebookVideoUrlRegex)) return await FacebookResolver(Query, YoutubeStreamOptions);
  if (Query.match(SoundCloundUrlRegex)) {
    return await SoundCloudExtractor.SoundCloudResolver(
      Query,
      Query.match(SoundCloundUrlRegex),
      YoutubeStreamOptions,
    );
  }
  if (Query.toLowerCase().includes('www.reverbnation.com')) return await ReverbnationResolver(Query, YoutubeStreamOptions);
  return await QueryResolver(Query, YoutubeStreamOptions);
}

/**
 * @function StreamDownloader play-dl Stream Downloader for Music Players Node.jsv16
 * @param {String} Query Query for Searching Data as Tracks , Playlist or albums
 * @param {Object} YoutubeStreamOptions Youtube Stream Options for play-dl
 * @returns {Promise<YoutubeData>} play-dlTracks
 */

async function StreamDownloader(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
    IgnoreError: false,
  } || undefined,
) {
  const SpotifyUrlRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const SoundCloundUrlRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/;
  const FacebookVideoUrlRegex = /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/;
  if (!Query || (Query && typeof Query !== 'string')) throw TypeError('Query is invalid or is not String');
  if (Query.match(SpotifyUrlRegex)) return await SpotifyExtractor(Query, YoutubeStreamOptions, true);
  if (Query.match(FacebookVideoUrlRegex)) return await FacebookResolver(Query, YoutubeStreamOptions, true);
  if (Query.match(SoundCloundUrlRegex)) {
    return await SoundCloudExtractor.SoundCloudResolver(
      Query,
      Query.match(SoundCloundUrlRegex),
      YoutubeStreamOptions,
      true,
    );
  }
  if (Query.toLowerCase().includes('www.reverbnation.com')) return await ReverbnationResolver(Query, YoutubeStreamOptions, true);
  return await QueryResolver(Query, YoutubeStreamOptions, true);
}

module.exports = { Extractor, StreamDownloader };
