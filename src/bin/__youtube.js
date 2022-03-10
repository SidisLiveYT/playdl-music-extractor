const uriCheck = require('is-url');

class youtube {
  static __youtubeRegex = [
    /^(?:https?:\/\/)?(?:(?:www|m|music)\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
  ];

  static __youtubePlaylistRegex = /[?&]list=([^#\&\?]+)/;

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false;
      return returnRegexValue
        && Boolean(youtube.__youtubeRegex.find((regExp) => regExp.test(rawUrl)))
        ? rawUrl?.match(
            youtube.__youtubeRegex.find((regExp) => rawUrl.match(regExp)),
          )
            ?? false
            ?? (!uriCheck(rawUrl) ? rawUrl : false)
        : !uriCheck(rawUrl)
            ?? Boolean(
              youtube.__youtubeRegex.find((regExp) => regExp.test(rawUrl)),
            );
    } catch {
      return false;
    }
  }

  static async __extractor(rawQuery, __scrapperOptions, __cacheMain) {
    try {
      const playdlEngine = require('./__playdlEngine');
      return {
        playlist: Boolean(youtube.__youtubePlaylistRegex.test(rawQuery)),
        tracks:
          (await playdlEngine?.__rawExtractor(
            rawQuery,
            undefined,
            __scrapperOptions,
            __cacheMain,
          )) ?? [],
      };
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) return void __cacheMain.__errorHandling(rawError);
      throw rawError;
    }
  }
}
module.exports = youtube;
