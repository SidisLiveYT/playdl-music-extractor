const SpotifyExtractor = require('./bin/Spotify-Resolver');
const QueryResolver = require('./bin/Query-Resolver');
const SoundCloudExtractor = require('./bin/SoundCloud-Resolver');
const YoutubeData = require('../typings/instances-commonjs');

/**
 * @function Extractor Youtube-DL Extractor for Music Players Node.jsv16
 * @param {String} Query Query for Searching Data as Tracks , Playlist or albums
 * @returns {Promise<YoutubeData>} Youtube-DLTracks
 */

async function Extractor(Query) {
  const SpotifyUrlRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const SoundCloundUrlRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/;
  if (Query.match(SpotifyUrlRegex)) return await SpotifyExtractor(Query);
  if (Query.match(SoundCloundUrlRegex)) return await SoundCloudExtractor(Query, Query.match(SoundCloundUrlRegex));
  return await QueryResolver(Query);
}

module.exports = { Extractor };
