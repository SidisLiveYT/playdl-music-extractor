var YoutubeTrack = {
  Id: 0,
  url: null,
  title: null,
  author: null,
  author_link: null,
  description: null,
  custom_extractor: `youtube-dl`,
  duration: 0,
  human_duration: undefined,
  preview_stream_url: null,
  stream: null,
  stream_url: ' ', //Audio Filters Usage -> FFmpeg Workflow
  stream_type: undefined,
  stream_duration: 0,
  stream_video_Id: undefined,
  stream_human_duration: undefined,
  orignal_extractor: null | 'youtube' | 'spotify' | 'facebook' | 'arbitrary',
  thumbnail: null,
  channelId: 'none' | 0,
  channel_url: null,
  lyrics: '',
  likes: 0,
  is_live: false,
  dislikes: 0,
}

var YoutubeData = {
  playlist: false,
  tracks: [YoutubeTrack],
  error: undefined,
}

YoutubeStreamOptions = {
  Limit: 1,
  Quality: undefined,
  UserAgents: undefined,
  Cookies: undefined,
  IgnoreError: false,
}

module.exports = { YoutubeData , YoutubeStreamOptions }