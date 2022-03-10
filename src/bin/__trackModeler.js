const { stream, setToken, search } = require('play-dl');
const randomUserAgents = require('random-useragent').getRandom;
const ffmpeg = require('prism-media').FFmpeg;
const { getLyrics } = require('./__lyrics');
const soundCloud = require('./__soundCloud');
const youtube = require('./__youtube');

class Track {
  #__raw = {};

  constructor(rawBlueprint, __rawPlaydl) {
    if (__rawPlaydl) this.#__raw = __rawPlaydl;
    this.patch(rawBlueprint);
  }

  patch(rawBlueprint) {
    if (!rawBlueprint?.url) return undefined;
    this.trackId = rawBlueprint?.trackId;
    this.url = rawBlueprint?.url;
    this.videoId = rawBlueprint?.video_Id ?? rawBlueprint?.videoId;
    this.title = rawBlueprint?.title;
    this.description = rawBlueprint?.description;
    this.author = { name: rawBlueprint?.author, url: rawBlueprint?.author_link };
    this.extractorModel = {
      orignal: rawBlueprint?.orignal_extractor ?? 'Unknown',
      custom: rawBlueprint?.custom_extractor ?? 'play-dl',
    };
    this.duration = {
      ms: rawBlueprint?.duration,
      readable: rawBlueprint?.human_duration,
    };
    this.thumbnail = {
      Id: rawBlueprint?.video_Id ?? rawBlueprint?.videoId,
      url: rawBlueprint?.thumbnail,
    };
    this.channel = {
      name: rawBlueprint?.channelName ?? rawBlueprint?.author,
      Id: rawBlueprint?.channelId ?? rawBlueprint?.author,
      url: rawBlueprint?.channel_url ?? rawBlueprint?.author_link,
    };
    this.isLive = rawBlueprint?.is_live;
    this.ratings = {
      likes: parseInt(rawBlueprint?.likes ?? 0) ?? 0,
      dislikes: parseInt(rawBlueprint?.dislikes ?? 0) ?? 0,
    };
    return this;
  }

  async getStream(
    streamUrl,
    ignoreStreamError,
    __cacheMain,
    __streamCaches,
    reTryonRatelimit = true,
  ) {
    try {
      let __rawStream = {};
      let __garbageResults;
      let alterVideo = {};
      if (!this.url) return undefined;
      if (
        !(
          soundCloud.__test(this.#__raw?.url)
          || youtube.__test(this.#__raw?.url)
        )
        && !streamUrl
      ) {
        __garbageResults = (await search(this.title, { limit: 1 }))?.filter(
          Boolean,
        )?.[0];
        alterVideo = __garbageResults;
        __rawStream = await stream(__garbageResults?.url, {
          discordPlayerCompatibility: true,
        });
      } else if (
        streamUrl
        && typeof streamUrl === 'string'
        && streamUrl !== ''
      ) {
        const ffmpegArgs = [
          '-i',
          streamUrl,
          '-analyzeduration',
          '0',
          '-loglevel',
          '0',
          '-acodec',
          'libopus',
          '-f',
          'opus',
          '-ar',
          '48000',
          '-ac',
          '2',
        ];
        __rawStream = new ffmpeg({
          args: ffmpegArgs,
        });
      } else if (
        this.#__raw?.url
        && typeof this.#__raw?.url === 'string'
        && this.#__raw?.url !== ''
      ) {
        __rawStream = await stream(this.#__raw?.url, {
          discordPlayerCompatibility: true,
        });
      } else return undefined;
      this.stream = {
        buffer: __rawStream?.stream ?? __rawStream,
        videoUrl: alterVideo?.url ?? this.#__raw?.url,
        type: __rawStream?.type,
        duration: {
          ms:
            (alterVideo?.durationInSec ?? this.#__raw?.durationInSec ?? 0)
            * 1000,
          readable: Track.humanTimeConversion(
            (alterVideo?.durationInSec ?? this.#__raw?.durationInSec ?? 0)
              * 1000,
          ),
        },
        videoId: alterVideo?.id ?? this.#__raw?.id,
      };
      return this;
    } catch (rawError) {
      if (
        (ignoreStreamError
          || rawError?.message?.includes('429')
          || `${rawError}`?.includes('429'))
        && __cacheMain
        && !reTryonRatelimit
      ) {
        return void __cacheMain.__errorHandling(rawError);
      }
      if (
        (ignoreStreamError
          || rawError?.message?.includes('429')
          || `${rawError}`?.includes('429'))
        && __cacheMain
        && reTryonRatelimit
      ) {
        __cacheMain.__errorHandling(rawError);
        let __rawUserAgents = __streamCaches?.userAgents ?? [];
        __rawUserAgents = [randomUserAgents(), ...__rawUserAgents];
        await setToken({
          useragent: __rawUserAgents,
        });
        return await this.getStream(
          streamUrl,
          ignoreStreamError,
          __cacheMain,
          false,
        );
      }
      throw rawError;
    }
  }

  async getLyrics() {
    if (
      !(
        this.url
        && this.#__raw?.title
        && (this.author?.name
          ?? this.#__raw?.author?.name
          ?? this.#__raw?.artist?.name)
      )
    ) {
      return undefined;
    }
    this.lyrics = await getLyrics(
      this.#__raw?.title?.slice(0, 25)?.trim(),
      this.author?.name
        ?? this.#__raw?.author?.name
        ?? this.#__raw?.artist?.name,
    );
    return this.lyrics;
  }

  static humanTimeConversion(__durationMs = 0) {
    if (
      !(
        __durationMs
        && !Number.isNaN(__durationMs)
        && parseInt(__durationMs) > 0
      )
    ) {
      return undefined;
    }
    __durationMs /= 1000;
    let __string = '';
    for (
      let __cacheArray = [
          [Math.floor(__durationMs / 31536e3), 'Years'],
          [Math.floor((__durationMs % 31536e3) / 86400), 'Days'],
          [Math.floor(((__durationMs % 31536e3) % 86400) / 3600), 'Hours'],
          [
            Math.floor((((__durationMs % 31536e3) % 86400) % 3600) / 60),
            'Minutes',
          ],
          [
            Math.floor((((__durationMs % 31536e3) % 86400) % 3600) % 60),
            'Seconds',
          ],
        ],
        __alterArray = 0,
        __garbageValue = __cacheArray.length;
      __alterArray < __garbageValue;
      __alterArray++
    ) {
      __cacheArray[__alterArray][0] !== 0
        && (__string += ` ${__cacheArray[__alterArray][0]} ${
          __cacheArray[__alterArray][0] === 1
            ? __cacheArray[__alterArray][1].substr(
                0,
                __cacheArray[__alterArray][1].length - 1,
              )
            : __cacheArray[__alterArray][1]
        }`);
    }
    return __string.trim();
  }

  get raw() {
    if (!this.#__raw) return undefined;
    return this.#__raw;
  }
}

module.exports = Track;
