export type YoutubeTrack = {
  Id: Number
  url: String
  title: String
  video_Id: String
  author: String
  author_link: String
  description: String
  custom_extractor: `play-dl`
  duration: Number
  human_duration: Number
  stream: String
  stream_type: String
  stream_video_Id: String
  orignal_extractor: String | 'youtube' | 'spotify' | 'facebook' | 'arbitrary'
  thumbnail: String
  channelId: String | Number
  channel_url: String
  likes: Number
  is_live: Boolean
  dislikes: Number
  stream_duration: number
  human_stream_duration: Number
}

export type YoutubeStreamOptions = {
  Limit: number
  Quality: String
  Proxy: Array<String>
  IgnoreError: Boolean
}

export type YoutubeData = {
  playlist: Boolean
  tracks: Array<YoutubeTrack>
}
