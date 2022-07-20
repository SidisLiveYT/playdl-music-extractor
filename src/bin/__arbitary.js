const playdlEngine = require('./__playdlEngine');

class arbitary {
  static __arbitaryRegex = [
    /^(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#\/%=~_|]\.mp3$/,
    /^(https?|ftp|file):\/\/(www.)?(.*?)\.(mp3)$/gm,
    /^(https?|ftp|file):\/\/(www.)?(.*?)\.(mp3|mp4|wav|avi|m4a)$/gm,
  ];

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false;
      return returnRegexValue
        && Boolean(arbitary.__arbitaryRegex.find((regExp) => regExp.test(rawUrl)))
        ? rawUrl?.match(
            arbitary.__arbitaryRegex.find((regExp) => rawUrl.match(regExp)),
          ) ?? false
        : Boolean(
            arbitary.__arbitaryRegex.find((regExp) => regExp.test(rawUrl)),
          );
    } catch {
      return false;
    }
  }

  static async __extractor(rawUrl, __scrapperOptions, __cacheMain) {
    try {
      return {
        album: false,
        tracks: await playdlEngine.__rawExtractor(
          rawUrl,
          { stream: rawUrl, url: rawUrl, orignal_extractor: 'arbitary' },
          {
            ...__scrapperOptions,
            fetchOptions: { ...__scrapperOptions?.fetchOptions, fetchLimit: 1 },
          },
          __cacheMain,
        ),
      };
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) {
        return void __cacheMain.__errorHandling(rawError);
      }
      throw rawError;
    }
  }
}
module.exports = arbitary;
