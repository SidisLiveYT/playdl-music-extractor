const SoundCloud = require('@sidislive/soundcloud-scraper');
const PlayDLExtractor = require('./Track-Extractor');

class SoundCloudExtractor {
  static #TokenGen = undefined

  static #Client = undefined

  static async SoundCloudResolver(
    Query,
    RegexValue,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Cookies: undefined,
      Proxy: undefined,
    } || undefined,
    StreamDownloadBoolenRecord = undefined,
  ) {
    try {
      if (!SoundCloudExtractor.#TokenGen) {
        SoundCloudExtractor.#TokenGen = await SoundCloud.Util.keygen(true);
      }
      if (!SoundCloudExtractor.#Client) {
        SoundCloudExtractor.#Client = new SoundCloud.Client(
          SoundCloudExtractor.#TokenGen,
        );
      }
      if (
        (RegexValue[3] && RegexValue[3].includes('/sets/'))
        || (RegexValue[2] && RegexValue[2].includes('/sets/'))
        || (RegexValue[4] && RegexValue[4].includes('/sets/'))
        || Query.includes('/sets/')
      ) {
        const SoundCloudPlaylist = await SoundCloudExtractor.#Client.getPlaylist(
          Query,
        );
        const SoundCloudTracks = await Promise.all(
          SoundCloudPlaylist.tracks.map(
            async (track) => await SoundCloudExtractor.#SoundCloundTrackModel(
              track,
              YoutubeStreamOptions,
              StreamDownloadBoolenRecord,
            ),
          ),
        );
        return {
          playlist: true,
          tracks: SoundCloudTracks,
          error: undefined,
        };
      }
      const SoundCloudRawTrack = await SoundCloudExtractor.#Client.getSongInfo(
        Query,
      );
      return {
        playlist: false,
        tracks: [
          await SoundCloudExtractor.#SoundCloundTrackModel(
            SoundCloudRawTrack,
            YoutubeStreamOptions,
            StreamDownloadBoolenRecord,
          ),
        ],
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

  static async #SoundCloundTrackModel(
    SoundCloudRawTrack,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Cookies: undefined,
      Proxy: undefined,
    } || undefined,
    StreamDownloadBoolenRecord = undefined,
  ) {
    const track = {
      Id: SoundCloudRawTrack.id,
      url: SoundCloudRawTrack.url ?? undefined,
      title: SoundCloudRawTrack.title ?? undefined,
      author: SoundCloudRawTrack.author.name ?? undefined,
      author_link: SoundCloudRawTrack.author.url ?? undefined,
      description: SoundCloudRawTrack.description ?? undefined,
      custom_extractor: 'play-dl -> soundcloud',
      duration: SoundCloudRawTrack.duration ?? undefined,
      stream:
        SoundCloudRawTrack.streamURL
        && SoundCloudRawTrack.streamURL !== 'undefined'
          ? SoundCloudRawTrack.streamURL
          : undefined ?? undefined,
      orignal_extractor: 'soundcloud',
      thumbnail: SoundCloudRawTrack.thumbnail ?? undefined,
      channelId: undefined,
      channel_url: undefined,
      likes: SoundCloudRawTrack.likes ?? undefined,
      is_live: false,
      dislikes: undefined,
    };
    return (
      await PlayDLExtractor.DataExtractorYoutube(
        `${track.title} ${track.author.slice(0, 10)}`,
        'souncloud',
        YoutubeStreamOptions,
        track,
        StreamDownloadBoolenRecord,
      )
    )[0];
  }
}

module.exports = SoundCloudExtractor;
