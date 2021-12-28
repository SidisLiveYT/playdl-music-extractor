const SpotifyExtractor = require('./bin/Spotify-Resolver');
const QueryResolver = require('./bin/Query-Resolver');
const SoundCloudExtractor = require('./bin/SoundCloud-Resolver');
const {
  YoutubeData,
  YoutubeStreamOptions,
} = require('../typings/instances-commonjs');
const FacebookResolver = require('./bin/Facebook-Resolver');
const ReverbnationResolver = require('./bin/Reverbnation-Resolver');
const { HumanTimeConversion } = require('./bin/Track-Extractor');
const { GetLyrics } = require('./bin/Lyrics-Extractor');

/**
 * @function Extractor play-dl Extractor for Music Players Node.jsv16
 * @param {String} Query Query for Searching Data as Tracks , Playlist or albums
 * @param {Object<YoutubeStreamOptions>} YoutubeStreamOptions Youtube Stream Options for play-dl
 * @returns {Promise<YoutubeData>} play-dlTracks
 */

async function Extractor(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    UserAgents: undefined,
    Cookies: undefined,
    IgnoreError: false,
  } || undefined,
) {
  const SpotifyUrlRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist|episode|show)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const SoundCloundUrlRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/;
  const FacebookVideoUrlRegex = /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/;
  if (!Query || (Query && typeof Query !== 'string')) throw TypeError('Query is invalid or is not String');
  if (Query.match(SpotifyUrlRegex)) return Filteration(await SpotifyExtractor(Query, YoutubeStreamOptions));
  if (Query.match(FacebookVideoUrlRegex)) return Filteration(await FacebookResolver(Query, YoutubeStreamOptions));
  if (Query.match(SoundCloundUrlRegex)) {
    return Filteration(
      await SoundCloudExtractor.SoundCloudResolver(
        Query,
        Query.match(SoundCloundUrlRegex),
        YoutubeStreamOptions,
      ),
    );
  }
  if (Query.toLowerCase().includes('www.reverbnation.com')) return Filteration(await ReverbnationResolver(Query, YoutubeStreamOptions));
  return Filteration(await QueryResolver(Query, YoutubeStreamOptions));
}

/**
 * @function StreamDownloader play-dl Stream Downloader for Music Players Node.jsv16
 * @param {String} Query Query for Searching Data as Tracks , Playlist or albums
 * @param {Object<YoutubeStreamOptions>} YoutubeStreamOptions Youtube Stream Options for play-dl
 * @returns {Promise<YoutubeData>} play-dlTracks
 */

async function StreamDownloader(
  Query,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    UserAgents: undefined,
    Cookies: undefined,
    IgnoreError: false,
  } || undefined,
) {
  const SpotifyUrlRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist|show|episode)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const SoundCloundUrlRegex = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/;
  const FacebookVideoUrlRegex = /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/;
  if (!Query || (Query && typeof Query !== 'string')) throw TypeError('Query is invalid or is not String');
  if (Query.match(SpotifyUrlRegex)) {
    return Filteration(
      await SpotifyExtractor(Query, YoutubeStreamOptions, true),
    );
  }
  if (Query.match(FacebookVideoUrlRegex)) {
    return Filteration(
      await FacebookResolver(Query, YoutubeStreamOptions, true),
    );
  }
  if (Query.match(SoundCloundUrlRegex)) {
    return Filteration(
      await SoundCloudExtractor.SoundCloudResolver(
        Query,
        Query.match(SoundCloundUrlRegex),
        YoutubeStreamOptions,
        true,
      ),
    );
  }
  if (Query.toLowerCase().includes('www.reverbnation.com')) {
    return Filteration(
      await ReverbnationResolver(Query, YoutubeStreamOptions, true),
    );
  }
  return Filteration(await QueryResolver(Query, YoutubeStreamOptions, true));
}

function Filteration(DataStructure) {
  DataStructure.tracks = Array.isArray(DataStructure.tracks)
    ? DataStructure.tracks
    : [DataStructure.tracks];
  DataStructure.tracks = DataStructure.tracks.map((track) => {
    if (track && track.track) return track.track;
    return track;
  });
  DataStructure.error = DataStructure
    && DataStructure.tracks
    && DataStructure.tracks[0]
    && DataStructure.tracks[0].error
    ? DataStructure.tracks.map((track) => {
      if (track.error) return track.error;
      return undefined;
    })
    : DataStructure.error;
  if (DataStructure && DataStructure.tracks && DataStructure.tracks[0]) {
    DataStructure.tracks = DataStructure.tracks.filter(Boolean);
    DataStructure.error = DataStructure.error && DataStructure.error[0]
      ? DataStructure.error.filter(Boolean)
      : DataStructure.error;
  }
  return DataStructure;
}

module.exports = {
  Extractor,
  StreamDownloader,
  HumanTimeConversion,
  GetLyrics,
};
