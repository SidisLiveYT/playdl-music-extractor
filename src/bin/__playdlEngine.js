const {
  search,
  validate,
  setToken,
  playlist_info,
  video_info,
  deezer,
  spotify,
  soundcloud,
} = require('play-dl');
const randomUserAgents = require('random-useragent').getRandom;
const trackModel = require('./__trackModeler');
const Album = require('./__album');

class playdlEngine {
  static __cookies = undefined;

  static __userAgents = undefined;

  static async __rawExtractor(
    rawQuery,
    __trackBlueprint,
    __scrapperOptions,
    __cacheMain,
    __albumId,
  ) {
    if (!(rawQuery && typeof rawQuery === 'string' && rawQuery !== '')) {
      return undefined;
    }
    let __cacheGarbage;
    let __indexCount = 0;

    if (
      __scrapperOptions?.fetchOptions?.rawCookies
      && playdlEngine.__cookies !== __scrapperOptions?.fetchOptions?.rawCookies
    ) {
      playdlEngine.__cookies ??= __scrapperOptions?.fetchOptions?.rawCookies;
      await setToken({
        youtube: {
          cookie: playdlEngine.__cookies,
        },
      });
    }
    if (
      __scrapperOptions?.fetchOptions?.userAgents
      && typeof __scrapperOptions?.fetchOptions?.userAgents === 'string'
      && __scrapperOptions?.fetchOptions?.userAgents?.toLowerCase()?.trim()
        === 'random'
    ) {
      playdlEngine.__userAgents = [
        randomUserAgents(),
        randomUserAgents(),
        randomUserAgents(),
      ];
      await setToken({
        useragent: playdlEngine.__userAgents,
      });
    } else if (
      __scrapperOptions?.fetchOptions?.userAgents
      && Array.isArray(__scrapperOptions?.fetchOptions?.userAgents)
      && __scrapperOptions?.fetchOptions?.userAgents?.length > 0
    ) {
      playdlEngine.__userAgents = __scrapperOptions?.fetchOptions?.userAgents;
      await setToken({
        useragent: playdlEngine.__userAgents,
      });
    }
    const validatedResult = await validate(rawQuery)?.catch(() => undefined);
    const __searchResults = await playdlEngine.#__customSearch(
      rawQuery,
      __scrapperOptions,
      validatedResult,
      __cacheMain,
      __trackBlueprint?.orignal_extractor,
    );
    if (
      !(
        __searchResults?.tracks
        && Array.isArray(__searchResults?.tracks)
        && __searchResults?.tracks?.length > 0
      )
    ) {
      return undefined;
    }
    if (
      __scrapperOptions?.fetchOptions?.fetchLimit
      && !Number.isNaN(Number(__scrapperOptions?.fetchOptions?.fetchLimit))
      && parseInt(__scrapperOptions?.fetchOptions?.fetchLimit) > 0
      && parseInt(__scrapperOptions?.fetchOptions?.fetchLimit) < Infinity
      && !(
        (validatedResult?.includes('playlist')
          || validatedResult?.includes('album'))
        && Boolean(__scrapperOptions?.fetchOptions?.skipalbumLimit)
      )
    ) {
      __searchResults.tracks = __searchResults?.tracks
        ?.slice(0, parseInt(__scrapperOptions?.fetchOptions?.fetchLimit ?? 1))
        ?.filter(Boolean);
    }
    return (
      await Promise.all(
        __searchResults?.tracks?.map(async (__rawTrack) => {
          __cacheGarbage = await playdlEngine.__trackModelling(
            __rawTrack,
            {
              ...__trackBlueprint,
              Id: ++__indexCount,
            },
            __scrapperOptions,
            __albumId ?? __searchResults?.albumId ?? undefined,
            __cacheMain,
          );
          if (__cacheGarbage && __scrapperOptions?.eventReturn) {
            __cacheMain.emit(
              'track',
              __trackBlueprint?.orignal_extractor ?? 'youtube',
              __cacheGarbage?.album ?? undefined,
              __cacheGarbage,
              __scrapperOptions?.eventReturn?.metadata,
            );
          } else if (!__cacheGarbage) return undefined;
          return __cacheGarbage;
        }),
      )
    )?.filter(Boolean);
  }

  static async #__customSearch(
    rawQuery,
    __scrapperOptions,
    __validate,
    __cacheMain,
    extractor = 'arbitary',
  ) {
    if (extractor && extractor?.toLowerCase()?.trim() === 'arbitary') {
      return [
        {
          url: rawQuery,
        },
      ];
    }
    let __rawResults;
    let rawTracks;
    let rawAlbumId;
    let __videoDetails;
    const __validateResults = [];
    if (__validate && __validate?.includes('dz')) {
      __validateResults[0] = 'deezer';
    } else if (__validate && __validate?.includes('sp')) {
      __validateResults[0] = 'spotify';
    } else if (__validate && __validate?.includes('so')) {
      __validateResults[0] = 'soundcloud';
    } else if (__validate && __validate?.includes('yt')) {
      __validateResults[0] = 'youtube';
    }

    __validateResults[1] = __validate ? __validate?.split('_')?.[1] : undefined;
    switch (__validateResults[0]) {
      case 'youtube':
        if (
          ['video', 'track'].includes(
            __validateResults[1]?.toLowerCase()?.trim(),
          )
        ) {
          __videoDetails = (await video_info(rawQuery))?.video_details;
          return __videoDetails ? { tracks: [__videoDetails] } : undefined;
        }
        __rawResults = await playlist_info(rawQuery, {
          incomplete: true,
        });

        rawTracks = await __rawResults?.all_videos();
        rawAlbumId = Album.generate(
          __rawResults,
          rawTracks?.length,
          __cacheMain,
          true,
          __scrapperOptions?.eventReturn?.metadata,
        );
        return {
          albumId: rawAlbumId,
          tracks: rawTracks,
        };

      case 'deezer':
        __rawResults = await deezer(rawQuery);
        if (__rawResults && ['playlist', 'album'].includes(__rawResults.type)) {
          rawTracks = await __rawResults?.all_tracks();
          rawAlbumId = Album.generate(
            __rawResults,
            rawTracks?.length,
            __cacheMain,
            true,
            __scrapperOptions?.eventReturn?.metadata,
          );
          return {
            albumId: rawAlbumId,
            tracks: rawTracks,
          };
        }
        if (__rawResults && ['user'].includes(__rawResults)) return undefined;
        return { tracks: [__rawResults] };
      case 'soundcloud':
        __rawResults = await soundcloud(rawQuery);
        if (__rawResults && ['playlist', 'album'].includes(__rawResults.type)) {
          return { tracks: await __rawResults?.fetch() };
        }
        if (__rawResults && ['user'].includes(__rawResults)) return undefined;
        return { tracks: [__rawResults] };
      case 'spotify':
        __rawResults = await spotify(rawQuery);
        if (__rawResults && ['playlist', 'album'].includes(__rawResults.type)) {
          rawTracks = await __rawResults?.all_tracks();
          rawAlbumId = Album.generate(
            __rawResults,
            rawTracks?.length,
            __cacheMain,
            true,
            __scrapperOptions?.eventReturn?.metadata,
          );
          return {
            albumId: rawAlbumId,
            tracks: rawTracks,
          };
        }
        if (__rawResults && ['user'].includes(__rawResults)) return undefined;
        return { tracks: [__rawResults] };
      default:
        __rawResults = await search(rawQuery, {
          limit:
            [Infinity, 0].includes(
              __scrapperOptions?.fetchOptions?.fetchLimit ?? 1,
            ) || (__scrapperOptions?.fetchOptions?.fetchLimit ?? 1) <= 0
              ? 10
              : __scrapperOptions?.fetchOptions?.fetchLimit ?? 1,
        });
        if (
          __rawResults
          && Array.isArray(__rawResults)
          && __rawResults?.length > 1
        ) {
          return { tracks: __rawResults };
        }
        if (!__rawResults[0]?.url) return undefined;

        __videoDetails = (await video_info(__rawResults[0]?.url))
          ?.video_details;
        return __videoDetails
          ? { tracks: [__videoDetails] }
          : { tracks: __rawResults[0] };
    }
  }

  static async __trackModelling(
    __rawTrack,
    __trackBlueprint,
    __scrapperOptions,
    __albumId,
    __cacheMain,
  ) {
    try {
      await __cacheMain.__customRatelimit(__scrapperOptions?.ratelimit);
      const Track = new trackModel(
        {
          trackId: parseInt(__trackBlueprint?.Id ?? 0) || 0,
          url: __trackBlueprint?.url ?? __rawTrack?.url,
          video_Id: __trackBlueprint?.video_Id ?? __rawTrack?.id,
          title: __trackBlueprint?.title ?? __rawTrack?.title,
          author:
            __trackBlueprint?.author
            ?? __rawTrack?.artist?.name
            ?? __rawTrack?.channel?.name,
          author_link:
            __trackBlueprint?.author_link
            ?? __rawTrack?.artist?.url
            ?? __rawTrack?.channel?.url,
          description: __trackBlueprint?.description ?? __rawTrack?.description,
          custom_extractor: 'play-dl',
          duration:
            (__trackBlueprint?.is_live || __rawTrack?.live
              ? 0
              : __trackBlueprint?.duration)
            ?? (__rawTrack?.durationInSec ?? 0) * 1000,
          human_duration: trackModel.humanTimeConversion(
            (__trackBlueprint?.is_live || __rawTrack?.live
              ? 0
              : __trackBlueprint?.duration)
              ?? (__rawTrack?.durationInSec ?? 0) * 1000,
          ),
          orignal_extractor: __trackBlueprint?.orignal_extractor ?? 'youtube',
          thumbnail:
            __trackBlueprint?.thumbnail ?? __rawTrack?.thumbnails?.[0]?.url,
          channelName:
            __trackBlueprint?.channel_Name
            ?? __rawTrack?.channel?.name
            ?? __trackBlueprint?.author,
          channelId: __trackBlueprint?.author ?? __rawTrack?.channel?.id,
          channel_url:
            __trackBlueprint?.author_link ?? __rawTrack?.channel?.url,
          likes: __trackBlueprint?.likes ?? __rawTrack?.likes ?? 0,
          is_live: __trackBlueprint?.is_live ?? __rawTrack?.live ?? false,
          dislikes: __trackBlueprint?.dislikes ?? __rawTrack?.dislikes ?? 0,
          customMetadata: __scrapperOptions?.eventReturn?.metadata,
        },
        __rawTrack,
        __albumId,
      );
      if (__scrapperOptions?.streamDownload && __rawTrack?.url) {
        await Track.getStream(
          __trackBlueprint?.stream,
          __scrapperOptions?.ignoreInternalError,
          __cacheMain,
          {
            userAgents: playdlEngine.__userAgents,
          },
        );
      }
      if (__scrapperOptions?.fetchLyrics && __rawTrack?.url) {
        await Track.getLyrics();
      }
      return Track;
    } catch (rawError) {
      if (__scrapperOptions?.ignoreInternalError) {
        return void __cacheMain.__errorHandling(rawError);
      }
      throw rawError;
    }
  }
}

module.exports = playdlEngine;
