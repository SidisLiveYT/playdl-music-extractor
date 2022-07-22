declare type secretTokens = {
  spotify: {
    client_id: string | number;
    client_secret: string | number;
    refresh_token: string | number;
    market: string | "US";
  };
  soundcloud: { client_id: string | number };
};

declare type fetchOptions = {
  tokens: secretTokens;
  fetchLimit: number;
  streamQuality: string;
  rawCookies: string;
  userAgents: string[];
  skipalbumLimit: Boolean;
};

export type scrapperOptions = {
  fetchLyrics: boolean | "true";
  eventReturn: { metadata: any };
  ratelimit: number;
  ignoreInternalError: boolean | "true";
  fetchOptions: fetchOptions;
  streamDownload: boolean | "false";
};

export type extractorData = {
  album: Album | boolean;
  tracks: Array<Track>;
};

export class Track {
  public constructor(__scrapperOptions: scrapperOptions);
  public readonly __scrapperOptions: scrapperOptions;
  public getStream(
    extraStream: string,
    ignoreStreamError: boolean,
    __cacheMain: {},
    __streamCaches: { userAgents: string[] },
    reTryonRatelimit?: boolean | "true"
  ): Promise<Track> | undefined;
  public getLyrics(): Promise<string>;
  readonly albumId: String | number | undefined;
  readonly trackId: number;
  readonly url: string;
  readonly videoId: string | number;
  readonly title: string;
  readonly description: string;
  readonly author: { name: string; url: string };
  readonly extractorModel: {
    orignal:
      | string
      | "deezer"
      | "youtube"
      | "spotify"
      | "facebook"
      | "reverbnation"
      | "soundcloud"
      | "arbitary";
    custom: string | "play-dl";
  };
  readonly duration: {
    ms: number;
    readable: string;
  };
  readonly thumbnail: {
    Id: string | number;
    url: string;
  };
  readonly channel: {
    name: string;
    Id: string | number;
    url: string;
  };
  readonly isLive: boolean;
  readonly ratings: {
    likes: number | string;
    dislikes: number | string;
  };
  readonly stream: {
    buffer:
      | string
      | ReadableStream<Buffer>
      | "Fetched Stream from play-dl using stream() function or ffmpeg parsed Stream Url";
    videoUrl: string;
    type: string;
    duration: {
      ms: number;
      readable: string;
    };
    videoId: string | number;
  };
  customMetadata: any;
  readonly lyrics:
    | string
    | ""
    | "Lyrics fetched from Un-Official Source , so limited Resources are expected";
  readonly album: Album | "Related Playlist or Album with Track";
  readonly raw: {} | "Unparsed and fetched Track Data from play-dl";
}

export class Album {
  readonly Id: Number | String | undefined;
  readonly name: String;
  readonly url: String;
  readonly description: String;
  readonly thumbnail: String;
  readonly tracksCount: Number;
  readonly channel:
    | {
        name: String;
        description: String;
        url: String;
        thumbnail: String;
      }
    | undefined;
  readonly views: Number;
  customMetadata: any;
}

export type Awaitable<T> = T | PromiseLike<T>;

export interface trackEvents {
  track: [
    orignal_extractor:
      | string
      | "deezer"
      | "youtube"
      | "spotify"
      | "facebook"
      | "reverbnation"
      | "soundcloud"
      | "arbitary",
    album: Album,
    track: Track,
    metadata: any
  ];
  album: [Album];
}
