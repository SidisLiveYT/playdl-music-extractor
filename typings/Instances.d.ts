export type YoutubeTrack = {
  Id: 0
  url: String
  title: String
  video_Id: String
  author: String
  author_link: String
  description: String
  custom_extractor: `play-dl`
  duration: Number
  stream: String
  stream_type: String
  orignal_extractor: String | 'youtube' | 'spotify' | 'facebook' | 'arbitrary'
  thumbnail: String
  channelId: String | Number
  channel_url: String
  likes: Number
  is_live: Boolean
  dislikes: Number
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
