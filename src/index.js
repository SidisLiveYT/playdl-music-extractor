const path = require('path');
const EventEmitter = require('events');
const fileSystem = require('fs');
const spotify = require('./bin/__spotify');
const youtube = require('./bin/__youtube');
const soundcloud = require('./bin/__soundCloud');
const facebook = require('./bin/__facebook');
const reverbnation = require('./bin/__reverbnation');
const deezer = require('./bin/__deezer');
const Track = require('./bin/__trackModeler');

/**
 * @class playdl -> Main Handler to Fetch and Parse Songs from Youtube and SoundCloud and many Others from play-dl as its base source
 */

class playdl extends EventEmitter {
  /**
   * @constructor
   * @param {scrapperOptions} __scrapperOptions -> Scrapping Options for functions and base Source Engine
   */
  constructor(__scrapperOptions = playdl.#__privateCaches.__scrapperOptions) {
    super();
    this.__scrapperOptions = {
      ...playdl.#__privateCaches.__scrapperOptions,
      ...__scrapperOptions,
      fetchOptions: {
        ...playdl.#__privateCaches?.fetchOptions,
        ...__scrapperOptions?.fetchOptions,
      },
    };
  }

  /**
   * @static
   * @private
   * @property {Object} #__privateCaches -> Private Caches for functions to Store basic Options and Queue Data for Ratelimit
   */
  static #__privateCaches = {
    __ratelimitQueue: undefined,
    fetchOptions: {
      tokens: {},
      fetchLimit: Infinity,
      streamQuality: undefined,
      rawCookies: undefined,
      userAgents: undefined,
    },
    __scrapperOptions: {
      fetchLyrics: true,
      eventReturn: { metadata: undefined },
      ratelimit: 0,
      ignoreInternalError: true,
      fetchOptions: {
        fetchLimit: Infinity,
        streamQuality: undefined,
        rawCookies: undefined,
        userAgents: undefined,
      },
      streamDownload: false,
    },
  };

  /**
   * exec() -> Raw and in-built function for fetching Data for other methods with no exceptions
   * @param {string} rawQuery -> A String Value for Song Name or Url to be Parsed and Fetch Data about it
   * @param {scrapperOptions} __scrapperOptions -> Scrapping Options for functions and base Source Engine
   * @returns {Promise<extractorData>} playlist and Tracks from play-dl
   */
  async exec(
    rawQuery,
    __scrapperOptions = playdl.#__privateCaches.__scrapperOptions,
  ) {
    try {
      __scrapperOptions = {
        ...this.__scrapperOptions,
        ...__scrapperOptions,
        fetchOptions: {
          ...this.__scrapperOptions?.fetchOptions,
          ...__scrapperOptions?.fetchOptions,
        },
      };
      if (
        !(rawQuery && typeof rawQuery === 'string' && rawQuery?.trim() !== '')
      ) {
        throw new Error(
          'playdl-music-playdl Error : Invalid Query is Provided to Parse and Stream for Client',
        );
      }

      await this.__customRatelimit(__scrapperOptions?.ratelimit);
      if (spotify.__test(rawQuery)) return await spotify.__extractor(rawQuery, __scrapperOptions, this);
      if (soundcloud.__test(rawQuery)) return await soundcloud.__extractor(rawQuery, __scrapperOptions, this);
      if (facebook.__test(rawQuery)) return await facebook.__extractor(rawQuery, __scrapperOptions, this);
      if (reverbnation.__test(rawQuery)) return await reverbnation.__extractor(rawQuery, __scrapperOptions, this);
      if (deezer.__test(rawQuery)) return await deezer.__extractor(rawQuery, __scrapperOptions, this);
      if (youtube.__test(rawQuery)) return await youtube.__extractor(rawQuery, __scrapperOptions, this);
      throw new Error(
        'playdl-music-playdl Error : Un-Supportable Query is Provided to Parse and Stream for Client',
      );
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) return void this.__errorHandling(rawError);
      throw rawError;
    }
  }

  /**
   * streamExtractor() -> Raw and in-built function for fetching Data for other methods with no exceptions
   * @param {string} rawQuery -> A String Value for Song Name or Url to be Parsed and Fetch Data about it
   * @param {scrapperOptions} __scrapperOptions -> Scrapping Options for functions and base Source Engine
   * @param {string | "tracks" | "streams"} returnType Return Type for method , And Optional choice and By Default its -> "tracks"
   * @returns {Promise<Track[] | Object[]>} playlist and Tracks from play-dl
   */
  async streamExtractor(
    rawQuery,
    __scrapperOptions = playdl.#__privateCaches.__scrapperOptions,
    returnType = 'tracks',
  ) {
    const __rawResponse = await this.exec(rawQuery, {
      ...__scrapperOptions,
      streamDownload: true,
    });
    if (returnType && returnType?.toLowerCase()?.trim()?.includes('stream')) {
      return __rawResponse?.tracks?.filter((track) => track?.stream);
    }
    return __rawResponse?.tracks;
  }

  /**
   * softExtractor() -> Raw and in-built function for fetching Data for other methods with no exceptions
   * @param {string} rawQuery -> A String Value for Song Name or Url to be Parsed and Fetch Data about it
   * @param {scrapperOptions} __scrapperOptions -> Scrapping Options for functions and base Source Engine
   * @returns {Promise<Track[]>} playlist and Tracks from play-dl
   */
  async softExtractor(
    rawQuery,
    __scrapperOptions = playdl.#__privateCaches.__scrapperOptions,
  ) {
    const __rawResponse = await this.exec(rawQuery, {
      ...__scrapperOptions,
      fetchLyrics: false,
      streamDownload: false,
    });
    return __rawResponse?.tracks;
  }

  __errorHandling(error = new Error()) {
    if (!error?.message) return undefined;
    if (!fileSystem.existsSync(path.join(__dirname, '/cache'))) fileSystem.mkdirSync(path.join(__dirname, '/cache'));
    const __cacheLocation = path.join(__dirname, '/cache', '/__errorLogs.txt');
    if (!__cacheLocation) return undefined;
    if (!fileSystem.existsSync(__cacheLocation)) {
      fileSystem.writeFileSync(
        __cacheLocation,
        `${new Date()} | `
          + `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
      );
    } else if (
      (fileSystem.readFileSync(__cacheLocation)?.length ?? 0) < 500000
    ) {
      fileSystem.appendFileSync(
        __cacheLocation,
        `\n\n${new Date()} | `
          + `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
        'utf8',
      );
    } else {
      fileSystem.writeFileSync(
        __cacheLocation,
        `${new Date()} | `
          + `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
      );
    }
    return true;
  }

  async __customRatelimit(waitTime = 2 * 1000, forceSkip = false) {
    if (forceSkip) return true;
    const __rawtimeMs = new Date().getTime();
    playdl.#__privateCaches.__ratelimitQueue ??= __rawtimeMs;
    if (playdl.#__privateCaches.__ratelimitQueue - __rawtimeMs > 1000) {
      playdl.#__privateCaches.__ratelimitQueue += waitTime;
      await this.#sleep(playdl.#__privateCaches.__ratelimitQueue - __rawtimeMs);
      return true;
    }
    return true;
  }

  #sleep(waitTime = 2 * 1000) {
    if (!(waitTime && typeof waitTime === 'number' && waitTime > 500)) return true;
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  static playdlQuick = new playdl();
}

module.exports = playdl;
