const SoundCloud = require('@sidislive/soundcloud-scraper')
const PlayDLExtractor = require('./Track-Extractor')

class SoundCloudExtractor {
  static #TokenGen = null
  static #Client = null
  static async SoundCloudResolver(Query, RegexValue) {
    if (!SoundCloudExtractor.#TokenGen)
      SoundCloudExtractor.#TokenGen = await SoundCloud.Util.keygen(true)
    if (!SoundCloudExtractor.#Client)
      SoundCloudExtractor.#Client = new SoundCloud.Client(
        SoundCloudExtractor.#TokenGen,
      )
    if (
      (RegexValue[3] && RegexValue[3].includes('/sets/')) ||
      (RegexValue[2] && RegexValue[2].includes('/sets/')) ||
      (RegexValue[4] && RegexValue[4].includes('/sets/')) ||
      Query.includes('/sets/')
    ) {
      const SoundCloudPlaylist = await SoundCloudExtractor.#Client.getPlaylist(
        Query,
      )
      const SoundCloudTracks = await Promise.all(
        SoundCloudPlaylist.tracks.map(async (track) => {
          return await SoundCloudExtractor.#SoundCloundTrackModel(track)
        }),
      )
      return {
        playlist: true,
        tracks: SoundCloudTracks,
      }
    }
    const SoundCloudRawTrack = await SoundCloudExtractor.#Client.getSongInfo(
      Query,
    )
    return {
      playlist: false,
      tracks: [
        await SoundCloudExtractor.#SoundCloundTrackModel(SoundCloudRawTrack),
      ],
    }
  }
  static async #SoundCloundTrackModel(SoundCloudRawTrack) {
    const track = {
      Id: SoundCloudRawTrack.id,
      url: SoundCloudRawTrack.url ?? null,
      title: SoundCloudRawTrack.title ?? null,
      author: SoundCloudRawTrack.author.name ?? null,
      author_link: SoundCloudRawTrack.author.url ?? null,
      description: SoundCloudRawTrack.description ?? null,
      custom_extractor: 'youtube-dl -> soundcloud',
      duration: SoundCloudRawTrack.duration ?? null,
      stream_url:
        SoundCloudRawTrack.streamURL && SoundCloudRawTrack.streamURL !== 'null'
          ? SoundCloudRawTrack.streamURL
          : null ?? null,
      orignal_extractor: 'soundcloud',
      thumbnail: SoundCloudRawTrack.thumbnail ?? null,
      channelId: null,
      channel_url: null,
      likes: SoundCloudRawTrack.likes ?? null,
      is_live: false,
      dislikes: null,
    }
    return (
      await PlayDLExtractor.DataExtractorYoutube(
        track.title,
        'souncloud',
        track,
      )
    )[0]
  }
}

module.exports = SoundCloudExtractor
