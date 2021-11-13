export type YoutubeTrack = {
  Id: Number
  url: String
  video_Id: String
  title: String
  author: String
  author_link: String
  description: String
  custom_extractor: `youtube-dl`
  duration: Number
  human_duration: String
  preview_stream_url: String
  stream: String
  stream_url: String
  stream_type: String
  stream_duration: Number
  stream_video_Id: String
  stream_human_duration: String
  orignal_extractor: String | 'youtube' | 'spotify' | 'facebook' | 'arbitrary'
  thumbnail: String
  channelId: String | Number
  channel_url: String
  lyrics: String | Array<String> | undefined
  likes: Number
  is_live: Boolean
  dislikes: Number
}

export type YoutubeStreamOptions = {
  Limit: number
  Quality: String
  Cookies: String
  Proxy: Array<String>
  IgnoreError: Boolean
}

export type YoutubeData = {
  playlist: Boolean
  tracks: Array<YoutubeTrack>
  error: Error | String | undefined
}
