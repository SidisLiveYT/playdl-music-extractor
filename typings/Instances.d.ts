declare type secretTokens = {
  spotify: {
    client_id: string | number
    client_secret: string | number
    refresh_token: string | number
    market: string | 'US'
  }
  soundcloud: { client_id: string | number }
}

declare type fetchOptions = {
  tokens: secretTokens
  fetchLimit: number
  streamQuality: string
  rawCookies: string
  userAgents: string[]
}

declare type scrapperOptions = {
  fetchLyrics: true
  eventReturn: { metadata: any }
  ratelimit: number
  ignoreInternalError: true
  fetchOptions: fetchOptions
  streamDownload: false
}

declare type extractorData = {
  playlist: boolean
  tracks: Array<Track>
}

declare class Track {
  public constructor(__scrapperOptions: scrapperOptions)
  public readonly __scrapperOptions: scrapperOptions
  public getStream(
    extraStream: string,
    ignoreStreamError: boolean,
    __cacheMain: {},
    __streamCaches: { userAgents: string[] },
    reTryonRatelimit?: boolean | 'true',
  ): Promise<Track> | undefined
  public getLyrics(): Promise<string>
  readonly trackId: number
  readonly url: string
  readonly videoId: string | number
  readonly title: string
  readonly description: string
  readonly author: { name: string; url: string }
  readonly extractorModel: {
    orignal:
      | string
      | 'deezer'
      | 'youtube'
      | 'spotify'
      | 'facebook'
      | 'reverbnation'
      | 'soundcloud'
    custom: string | 'play-dl'
  }
  readonly duration: {
    ms: number
    readable: string
  }
  readonly thumbnail: {
    Id: string | number
    url: string
  }
  readonly channel: {
    name: string
    Id: string | number
    url: string
  }
  readonly isLive: boolean
  readonly ratings: {
    likes: number | string
    dislikes: number | string
  }
  readonly stream: {
    buffer:
      | string
      | ReadableStream<Buffer>
      | 'Fetched Stream from play-dl using stream() function or ffmpeg parsed Stream Url'
    videoUrl: string
    type: string
    duration: {
      ms: number
      readable: string
    }
    videoId: string | number
  }
  readonly lyrics:
    | string
    | ''
    | 'Lyrics fetched from Un-Official Source , so limited Resources are expected'
  readonly raw: {} | 'Unparsed and fetched Track Data from play-dl'
}

declare type Awaitable<T> = T | PromiseLike<T>

declare interface trackEvents {
  tracks: [
    orignal_extractor: string | 'deezer' | 'youtube' | 'spotify' | 'facebook' | 'reverbnation' | 'soundcloud',
    track: Track,
    metadata: any
  ]
}
