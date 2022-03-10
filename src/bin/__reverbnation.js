const reverbnationParser = require('reverbnation-scraper');
const playdlEngine = require('./__playdlEngine');

class reverbnation {
  static __reverbnationRegex = [
    /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(reverbnation\.com)\/(.*)$/,
    /^((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(reverbnation.com\/)+[a-zA-Z0-9\-\.]+(\/)+[a-zA-Z0-9\-\.]+/,
    /^(https?:\/\/)?(www.)?(m\.)?reverbnation\.com\/[\w\-\.]+(\/)+[\w\-\.]+/,
  ];

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false;
      return returnRegexValue
          && Boolean(
            reverbnation.__reverbnationRegex.find((regExp) => regExp.test(rawUrl)),
          )
        ? rawUrl?.match(
          reverbnation.__reverbnationRegex.find((regExp) => rawUrl.match(regExp)),
        ) ?? false
        : Boolean(
          reverbnation.__reverbnationRegex.find((regExp) => regExp.test(rawUrl)),
        );
    } catch {
      return false;
    }
  }

  static async __extractor(rawQuery, __scrapperOptions, __cacheMain) {
    try {
      const __rawData = await reverbnationParser.getInfo(rawQuery);
      return {
        playlist: false,
        tracks: await playdlEngine.__rawExtractor(
          __rawData?.title?.slice(0, 10) ?? __rawData?.[0]?.title?.slice(0, 10),
          __rawData?.songs?.[0]?.streamURL
            ? { stream: __rawData?.songs?.[0]?.streamURL, ...__rawData }
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

module.exports = reverbnation;
