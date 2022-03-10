const Axios = require('axios').default;
const playdlEngine = require('./__playdlEngine');

class facebook {
  static __facebookRegex = [
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
    /^https?:\/\/www\.(facebook|fb)\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/gm,
    /(?:https?:\/{2})?(?:w{3}\.)?(facebook|fb).com\/.*\/videos\/.*/,
    /^(?:(https?):\/\/)?(?:(?:www|m|)\.)?(fb\.com|fb\.watch|facebook\.com|facebook\.watch)\/(.*)$/,
  ];

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false;
      return returnRegexValue
        && Boolean(facebook.__facebookRegex.find((regExp) => regExp.test(rawUrl)))
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
      const __rawData = await facebook.__rawFetch(
        rawQuery,
        __cacheMain,
        __scrapperOptions?.ignoreInternalError,
      );
      if (!__rawData) throw new Error("Facebook Metadata can't be fetched with given link");
      else {
        return {
          playlist: false,
          tracks: await playdlEngine.__rawExtractor(
            __rawData?.title?.slice(0, 10)?.trim(),
            __rawData,
            {
              ...__scrapperOptions,
              fetchOptions: {
                ...__scrapperOptions?.fetchOptions,
                fetchLimit: 1,
              },
            },
            __cacheMain,
          ),
        };
      }
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) return void __cacheMain.__errorHandling(rawError);
      throw rawError;
    }
  }

  static async __rawFetch(rawQuery, __cacheMain, ignoreInternalError = false) {
    try {
      const __rawBody = await Axios.get(rawQuery);
      if (!(__rawBody && __rawBody?.status === 200)) return undefined;
      const __rawBackup = {
        title:
          __rawBody?.data?.split('<title>')?.[1]?.split('</title>')?.[0]
          ?? undefined,
        description:
          __rawBody?.data
            ?.split('"description" content=')?.[1]
            ?.split('/>')?.[0] ?? undefined,
      };
      const __rawJson = JSON.parse(
        __rawBody?.data
          ?.split('<script ')[1]
          ?.split('">')[1]
          ?.split('</script>')[0],
      );
      if (__rawJson.author?.name) __rawBackup.author = __rawJson.author?.name;
      if (__rawJson.author?.url) __rawBackup.author_link = __rawJson.author?.url;
      if (__rawJson.author?.url) __rawBackup.author_link = __rawJson.author?.url;
      if (__rawJson.url) __rawBackup.url = __rawJson.url;
      if (__rawJson.articleBody) __rawBackup.description = __rawJson.articleBody;
      if (
        __rawJson.interactionStatistic
        && Array.isArray(__rawJson.interactionStatistic)
        && __rawJson.interactionStatistic?.length > 0
      ) {
        __rawBackup.likes = parseInt(
          __rawJson.interactionStatistic?.find(
            (stats) => stats?.interactionType
              && typeof stats?.interactionType === 'string'
              && stats?.interactionType?.toLowerCase()?.trim()?.includes('like'),
          )?.userInteractionCount ?? 0,
        );
      }
      return __rawBackup;
    } catch (rawError) {
      if (ignoreInternalError) return void __cacheMain.__errorHandling(rawError);
      throw rawError;
    }
  }
}

module.exports = facebook;
