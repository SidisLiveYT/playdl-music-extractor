const rawSoundCloud = require('@sidislive/soundcloud-scraper');
const { setToken } = require('play-dl');
const playdlEngine = require('./__playdlEngine');

class soundCloud {
  static __soundcloudTokenGen = undefined;

  static __soundcloudClient = undefined;

  static __soundCloudCachedToken = undefined;

  static __soundCloudRegex = [
    /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc|soundcloud\.app\.goo\.gl)\/(.*)$/,
    /^((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(soundcloud.com\/)+[a-zA-Z0-9\-\.]+(\/)+[a-zA-Z0-9\-\.]+/,
    /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+/,
  ];

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) return false;
      return returnRegexValue
        && Boolean(
          soundCloud.__soundCloudRegex.find((regExp) => regExp.test(rawUrl)),
        )
        ? rawUrl?.match(
            soundCloud.__soundCloudRegex.find((regExp) => rawUrl.match(regExp)),
          ) ?? false
        : Boolean(
            soundCloud.__soundCloudRegex.find((regExp) => regExp.test(rawUrl)),
          );
    } catch {
      return false;
    }
  }

  static async __extractor(rawQuery, __scrapperOptions, __cacheMain) {
    try {
      if (!soundCloud.__soundcloudTokenGen) {
        soundCloud.__soundcloudTokenGen = await rawSoundCloud?.Util?.keygen(
          true,
        );
      }

      if (!soundCloud.__soundcloudClient) {
        soundCloud.__soundcloudClient = new rawSoundCloud.Client(
          soundCloud.__soundcloudTokenGen,
        );
      }

      const __rawRegex = soundCloud.__test(rawQuery, true);
      let __rawTracks;
      let __cacheCount = 0;
      let __cacheGarbage;
      if (
        __scrapperOptions?.fetchOptions?.tokens?.soundcloud?.client_id
        || soundCloud.__soundCloudCachedToken?.client_id
      ) {
        return {
          playlist: Boolean(
            __rawRegex?.[3]?.includes('/sets/')
              || __rawRegex?.[2]?.includes('/sets/')
              || __rawRegex?.[4]?.includes('/sets/')
              || rawQuery.includes('/sets/'),
          ),
          tracks: await soundCloud.__tokenExtractor(
            rawQuery,
            __scrapperOptions,
            __cacheMain,
          ),
        };
      }
      if (!__rawRegex) return undefined;
      if (
        __rawRegex?.[3]?.includes('/sets/')
        || __rawRegex?.[2]?.includes('/sets/')
        || __rawRegex?.[4]?.includes('/sets/')
        || rawQuery.includes('/sets/')
      ) {
        __rawTracks = (
          await soundCloud.__soundcloudClient.getPlaylist(rawQuery)
        )?.tracks?.filter(Boolean);
      } else {
        __rawTracks = [
          await soundCloud.__soundcloudClient.getSongInfo(rawQuery),
        ];
      }

      const __soundCloudTracks = await Promise.all(
        __rawTracks?.map(async (rawTrack) => {
          if (
            !rawTrack
            || (__cacheCount
              && __cacheCount >= __scrapperOptions?.fetchOptions?.fetchLimit)
          ) return undefined;
          __cacheGarbage = await soundCloud.__trackParser(
            rawTrack,
            __scrapperOptions,
            __cacheMain,
          );
          ++__cacheCount;
          return __cacheGarbage;
        }),
      );
      return {
        playlist: Boolean(
          __rawRegex?.[3]?.includes('/sets/')
            || __rawRegex?.[2]?.includes('/sets/')
            || __rawRegex?.[4]?.includes('/sets/')
            || rawQuery.includes('/sets/'),
        ),
        tracks: __soundCloudTracks?.filter(Boolean),
      };
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) return void __cacheMain.__errorHandling(rawError);
      throw rawError;
    }
  }

  static async __tokenExtractor(rawUrl, __scrapperOptions, __cacheMain) {
    try {
      if (
        !__scrapperOptions?.fetchOptions?.tokens?.soundcloud?.client_id
        && !soundCloud.__soundCloudCachedToken?.client_id
      ) {
        throw new Error(
          'SoundCloud Error : SoundCloud Token Error , Please Check if you provided "client_id" , just like official "play-dl"',
        );
      }
      await setToken({
        soundcloud:
          __scrapperOptions?.fetchOptions?.tokens?.soundcloud
          ?? soundCloud.__soundCloudCachedToken,
      });
      soundCloud.__soundCloudCachedToken
        ??= __scrapperOptions?.fetchOptions?.tokens?.soundcloud;
      return await playdlEngine.__rawExtractor(
        rawUrl,
        { orignal_extractor: 'soundcloud' },
        __scrapperOptions,
        __cacheMain,
      );
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) return void __cacheMain.__errorHandling(rawError);
      throw rawError;
    }
  }

  static async __trackParser(rawTrack, __scrapperOptions, __cacheMain) {
    const __trackBlueprint = {
      Id: rawTrack?.id,
      url: rawTrack?.url,
      title: rawTrack?.title,
      author: rawTrack?.author.name,
      author_link: rawTrack?.author.url,
      description: rawTrack?.description,
      custom_extractor: 'play-dl',
      duration: rawTrack?.duration,
      stream:
        (rawTrack?.streamURL && rawTrack?.streamURL !== 'undefined'
          ? rawTrack?.streamURL
          : undefined) ?? undefined,
      orignal_extractor: 'soundcloud',
      thumbnail: rawTrack?.thumbnail,
      likes: rawTrack?.likes ?? 0,
      is_live: false,
      dislikes: 0,
    };
    return (
      await playdlEngine.__rawExtractor(
        __trackBlueprint?.title?.length >= 12
          ? __trackBlueprint?.title?.slice(0, 12)?.trim()
          : `${__trackBlueprint?.title}|${__trackBlueprint.author}`,
        __trackBlueprint,
        {
          ...__scrapperOptions,
          fetchOptions: { ...__scrapperOptions?.fetchOptions, fetchLimit: 1 },
        },
        __cacheMain,
      )
    )?.[0];
  }
}

module.exports = soundCloud;
