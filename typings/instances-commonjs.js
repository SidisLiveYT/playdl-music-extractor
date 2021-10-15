var YoutubeTrack = {
  Id: 0,
  url: null,
  title: null,
  author: null,
  author_link: null,
  description: null,
  custom_extractor: `play-dl`,
  duration: 0,
  stream: null,
  stream_type: null,
  orignal_extractor: null | 'youtube' | 'spotify' | 'facebook' | 'arbitrary',
  thumbnail: null,
  channelId: null | 0,
  channel_url: null,
  likes: 0,
  is_live: false,
  dislikes: 0,
}

var YoutubeData = {
  playlist: false,
  tracks: [YoutubeTrack],
}

module.exports = YoutubeData
