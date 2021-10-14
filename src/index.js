const SpotifyExtractor = require('./bin/Spotify-Resolver');
const QueryResolver = require('./bin/Query-Resolver');
const SoundCloudExtractor = require('./bin/SoundCloud-Resolver');
const YoutubeData = require('../typings/instances-commonjs');
const FacebookResolver = require('./bin/Facebook-Resolver');

/**
 * @function Extractor Youtube-DL Extractor for Music Players Node.jsv16
 * @param {String} Query Query for Searching Data as Tracks , Playlist or albums
 * @returns {Promise<YoutubeData>} Youtube-DLTracks
 */

async function Extractor(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
  } || undefined,
) {
  const SpotifyUrlRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const SoundCloundUrlRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/;
  const FacebookVideoUrlRegex = /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/;
  if (Query.match(SpotifyUrlRegex)) return await SpotifyExtractor(Query, YoutubeStreamOptions);
  if (Query.match(FacebookVideoUrlRegex)) return await FacebookResolver(Query, YoutubeStreamOptions);
  if (Query.match(SoundCloundUrlRegex)) {
    return await SoundCloudExtractor.SoundCloudResolver(
      Query,
      Query.match(SoundCloundUrlRegex),
      YoutubeStreamOptions,
    );
  }
  return await QueryResolver(Query, YoutubeStreamOptions);
}

module.exports = { Extractor };
