const playdlEngine = require('./__playdlEngine');

class deezer {
  static __dezerRegex = [
    /^https?:\/\/(?:www\.)?deezer\.com\/([^#/\&\?]+)\/(track|album|playlist)\/(\d+)$/,
    /^https?:\/\/(?:www\.)?deezer\.com\/([^#/\&\?]+)\/(track)\/(\d+)$/,
    /^https?:\/\/(?:www\.)?deezer\.com\/([^#/\&\?]+)\/(album|playlist)\/(\d+)$/,
  ];

  static __dezerTrackRegex = /^https?:\/\/(?:www\.)?deezer\.com\/([^#/\&\?]+)\/(track)\/(\d+)$/;

  static __dezeralbumRegex = /^https?:\/\/(?:www\.)?deezer\.com\/([^#/\&\?]+)\/(album|playlist)\/(\d+)$/;

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) { return false; }
      return returnRegexValue
        && Boolean(deezer.__dezerRegex.find((regExp) => regExp.test(rawUrl)))
        ? rawUrl?.match(
            deezer.__dezerRegex.find((regExp) => rawUrl.match(regExp)),
          ) ?? false
        : Boolean(deezer.__dezerRegex.find((regExp) => regExp.test(rawUrl)));
    } catch {
      return false;
    }
  }

  static async __extractor(rawUrl, __scrapperOptions, __cacheMain) {
    try {
      const rawTracks = await playdlEngine.__rawExtractor(
        rawUrl,
        { orignal_extractor: 'deezer' },
        __scrapperOptions,
        __cacheMain,
      );
      return {
        album:
          rawTracks?.find((track) => track?.albumId)?.album
          ?? deezer.__dezeralbumRegex.test(rawUrl),
        tracks: rawTracks,
      };
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) {
        return void __cacheMain.__errorHandling(rawError);
      }
      throw rawError;
    }
  }
}

module.exports = deezer;
