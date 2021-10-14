export type YoutubeTrack = {
  Id: 0
  url: String
  title: String
  author: String
  author_link: String
  description: String
  custom_extractor: `youtube-dl`
  duration: Number
  stream_url: String
  orignal_extractor: String | 'youtbe' | 'spotify' | 'facebook' | 'arbitary'
  thumbnail: String
  channelId: String | Number
  channel_url: String
  likes: Number
  is_live: Boolean
  dislikes: Number
}

export type YoutubeData = {
  playlist : Boolean,
  tracks : Array<YoutubeTrack>
}
