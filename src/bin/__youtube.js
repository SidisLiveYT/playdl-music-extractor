const uriCheck = require('is-url');

class youtube {
  static __youtubeRegex = [
    /^(?:https?:\/\/)?(?:(?:www|m|music)\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
    /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
  ];

  static __youtubealbumRegex = [
    /[?&]list=([^#\&\?]+)/,
    /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
  ];

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) {
        return false;
      }
      if (
        returnRegexValue
        && Boolean(youtube.__youtubeRegex.find((regExp) => regExp.test(rawUrl)))
      ) {
        return (
          rawUrl?.match(
            youtube.__youtubeRegex.find(
              (regExp) => rawUrl.match(regExp)?.length > 2,
            ),
          ) ?? (!uriCheck(rawUrl) ? rawUrl : false)
        );
      }
      return (
        Boolean(youtube.__youtubeRegex.find((regExp) => regExp.test(rawUrl)))
        || !uriCheck(rawUrl)
      );
    } catch {
      return false;
    }
  }

  static async __extractor(rawQuery, __scrapperOptions, __cacheMain) {
    try {
      if (!uriCheck(rawQuery)) {
 __scrapperOptions = {
          ...__scrapperOptions,
          fetchOptions: { ...__scrapperOptions?.fetchOptions, fetchLimit: 1 },
        };
}
      const playdlEngine = require('./__playdlEngine');
      const rawTracks = (await playdlEngine?.__rawExtractor(
          rawQuery,
          { orignal_extractor: 'youtube' },
          __scrapperOptions,
          __cacheMain,
        )) ?? [];
      return {
        album:
          rawTracks?.find((track) => track?.albumId)?.album
          ?? Boolean(
            youtube.__youtubealbumRegex.find((regExp) => regExp.test(rawQuery)),
          ),
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
module.exports = youtube;
