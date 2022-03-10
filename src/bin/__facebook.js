const facebookParser = require('facebook-video-link');
const playdlEngine = require('./__playdlEngine');

class facebook {
  static __facebookRegex = [
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
  ];

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false;
      return returnRegexValue
          && Boolean(
            facebook.__facebookRegex.find((regExp) => regExp.test(rawUrl)),
          )
        ? rawUrl?.match(
          facebook.__facebookRegex.find((regExp) => rawUrl.match(regExp)),
        ) ?? false
        : Boolean(
          facebook.__facebookRegex.find((regExp) => regExp.test(rawUrl)),
        );
    } catch {
      return false;
    }
  }

  static async __extractor(rawQuery, __scrapperOptions, __cacheMain) {
    try {
      const __rawData = await facebookParser(rawQuery);
      return {
        playlist: false,
        tracks: await playdlEngine.__rawExtractor(
          __rawData?.title?.slice(0, 10) ?? __rawData?.[0]?.title?.slice(0, 10),
          __rawData?.link
            ? { stream: __rawData?.link, ...__rawData }
            : undefined,
          {
            ...__scrapperOptions,
            fetchOptions: { ...__scrapperOptions?.fetchOptions, fetchLimit: 1 },
          },
          __cacheMain,
        ),
      };
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) return void __cacheMain.__errorHandling(rawError);
      throw rawError;
    }
  }
}

module.exports = facebook;
