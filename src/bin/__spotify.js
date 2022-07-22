const fetch = require('isomorphic-unfetch');
const { getData, getPreview } = require('spotify-url-info')(fetch);
const { setToken } = require('play-dl');
const playdlEngine = require('./__playdlEngine');
const Album = require('./__album');

class spotify {
  static __spotifyCachedToken;

  static __spotifyRegex = [
    /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist|show|episode)(?::|\/)((?:[0-9a-zA-Z]){22})/,
  ];

  static __spotifyalbumRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;

  static __test(rawUrl, returnRegexValue = false) {
    try {
      if (!(rawUrl && typeof rawUrl === 'string' && rawUrl !== '')) {
        return false;
      }
      return returnRegexValue
        && Boolean(spotify.__spotifyRegex.find((regExp) => regExp.test(rawUrl)))
        ? rawUrl?.match(
            spotify.__spotifyRegex.find((regExp) => rawUrl.match(regExp)),
          ) ?? false
        : Boolean(spotify.__spotifyRegex.find((regExp) => regExp.test(rawUrl)));
    } catch {
      return false;
    }
  }

  static async __extractor(rawUrl, __scrapperOptions, __cacheMain) {
    if (!rawUrl) return undefined;
    try {
      const __rawData = await getData(rawUrl);
      let __arryData;
      let rawAlbumId;
      let __cacheGarbage;
      let __cacheCount = 0;
      if (
        (__rawData?.type
          && ['track', 'episode'].includes(
            __rawData?.type?.toLowerCase()?.trim(),
          ))
        || __rawData?.show
      ) {
        __arryData = [__rawData];
      } else if (
        __rawData?.tracks?.items
        && Array.isArray(__rawData?.tracks?.items)
        && __rawData?.tracks?.items?.length > 0
      ) {
        __arryData = __rawData?.tracks?.items
          ?.filter(
            (rawVideo) => (rawVideo?.track?.name && rawVideo?.track?.name !== '')
              || (rawVideo?.name && rawVideo?.name !== ''),
          )
          ?.filter(Boolean);
        rawAlbumId = Album.generate(
          __rawData,
          __arryData?.length,
          __cacheMain,
          true,
          __scrapperOptions?.eventReturn?.metadata,
        );
      }
      if (
        (__scrapperOptions?.fetchOptions?.tokens?.spotify?.client_id
          && __scrapperOptions?.fetchOptions?.tokens?.spotify?.client_secret
          && __scrapperOptions?.fetchOptions?.tokens?.spotify?.refresh_token
          && __scrapperOptions?.fetchOptions?.tokens?.spotify?.market)
        || spotify.__spotifyCachedToken
      ) {
        return {
          album: Boolean(
            __rawData?.tracks?.items
              && Array.isArray(__rawData?.tracks?.items)
              && __rawData?.tracks?.items?.length > 0,
          ),
          tracks: await spotify.__tokenExtractor(
            rawUrl,
            __scrapperOptions,
            __cacheMain,
          ),
        };
      }

      const __processedTracks = (
          await Promise.all(
            __arryData?.map(async (rawTrack) => {
              if (
                !rawTrack
                || (__cacheCount
                  && __cacheCount >= __scrapperOptions?.fetchOptions?.fetchLimit
                  && !(
                    Boolean(
                      __rawData?.tracks?.items
                        && Array.isArray(__rawData?.tracks?.items)
                        && __rawData?.tracks?.items?.length > 0,
                    )
                    && Boolean(__scrapperOptions?.fetchOptions?.skipalbumLimit)
                  ))
              ) {
                return undefined;
              }
              __cacheGarbage = await spotify.__trackParser(
                rawTrack,
                ++__cacheCount,
                __scrapperOptions,
                __cacheMain,
                rawAlbumId,
              );
              return __cacheGarbage?.[0];
            }),
          )
        )?.filter(Boolean) ?? [];
      return {
        album:
          __processedTracks?.find((track) => track?.albumId)?.album
          ?? Boolean(
            __rawData?.tracks?.items
              && Array.isArray(__rawData?.tracks?.items)
              && __rawData?.tracks?.items?.length > 0,
          ),
        tracks: __processedTracks,
      };
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) {
        return void __cacheMain.__errorHandling(rawError);
      }
      throw rawError;
    }
  }

  static async __tokenExtractor(rawUrl, __scrapperOptions, __cacheMain) {
    try {
      if (
        !(
          __scrapperOptions?.fetchOptions?.tokens?.spotify?.client_id
          && __scrapperOptions?.fetchOptions?.tokens?.spotify?.client_secret
          && __scrapperOptions?.fetchOptions?.tokens?.spotify?.refresh_token
          && __scrapperOptions?.fetchOptions?.tokens?.spotify?.market
        )
        && !(
          spotify.__spotifyCachedToken?.client_id
          && spotify.__spotifyCachedToken?.client_secret
          && spotify.__spotifyCachedToken?.refresh_token
          && spotify.__spotifyCachedToken?.market
        )
      ) {
        throw new Error(
          'spotify Error : Spotify Token Error , Please Check if you provided "client_id","client_secret","refresh_token","market" , just like official "play-dl"',
        );
      }
      await setToken({
        spotify: __scrapperOptions?.fetchOptions?.tokens?.spotify,
      });
      return await playdlEngine.__rawExtractor(
        rawUrl,
        { orignal_extractor: 'spotify' },
        __scrapperOptions,
        __cacheMain,
      );
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) {
        return void __cacheMain.__errorHandling(rawError);
      }
      throw rawError;
    }
  }

  static async __trackParser(
    rawTrack,
    trackIndex,
    __scrapperOptions,
    __cacheMain,
    rawAlbumId,
  ) {
    if (!(rawTrack?.id || rawTrack?.track?.id)) return undefined;
    const __previewCaches = await getPreview(
      (rawTrack?.show && rawTrack?.id
        ? `https://open.spotify.com/episode/${rawTrack.id}`
        : undefined)
        ?? (rawTrack?.id || rawTrack?.track?.id
          ? `https://open.spotify.com/track/${
              rawTrack?.id ?? rawTrack?.track?.id
            }`
          : undefined),
    );
    const __trackBlueprint = {
      Id: trackIndex ?? 0,
      url:
        rawTrack?.external_urls?.spotify
        ?? rawTrack?.track?.external_urls?.spotify
        ?? __previewCaches?.link,
      title: rawTrack?.name ?? rawTrack?.track?.name ?? __previewCaches?.title,
      video_Id: rawTrack?.track?.id ?? rawTrack?.id,
      author:
        __previewCaches?.artist
        ?? rawTrack?.artists?.[0]?.name
        ?? rawTrack?.track?.artists?.[0]?.name,
      author_link:
        rawTrack?.artists?.[0].external_urls?.spotify
        ?? rawTrack?.track?.artists?.[0].external_urls?.spotify,
      description: rawTrack?.description ?? __previewCaches?.description,
      duration: rawTrack?.duration_ms ?? rawTrack?.track?.duration_ms,
      orignal_extractor: 'spotify',
      thumbnail: __previewCaches?.image,
      channelId:
        __previewCaches?.artist
        ?? rawTrack?.artists?.[0]?.name
        ?? rawTrack?.track?.artists?.[0]?.name,
      channel_url:
        rawTrack?.artists?.[0].external_urls?.spotify
        ?? rawTrack?.track?.artists?.[0].external_urls?.spotify,
      is_live: false,
    };
    return await playdlEngine.__rawExtractor(
      __trackBlueprint?.title
        && __trackBlueprint?.author
        && __trackBlueprint?.title?.length < 14
        ? `${__trackBlueprint?.title}|${__trackBlueprint?.author}`
        : __trackBlueprint?.title,
      __trackBlueprint,
      {
        ...__scrapperOptions,
        fetchOptions: { ...__scrapperOptions?.fetchOptions, fetchLimit: 1 },
      },
      __cacheMain,
      rawAlbumId,
    );
  }
}

module.exports = spotify;
