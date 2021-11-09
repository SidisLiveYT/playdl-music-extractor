const { getData, getPreview } = require('spotify-url-info');
const PlayDLExtractor = require('./Track-Extractor');

async function SpotifyScrapper(
  Url,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Cookies: undefined,
    Proxy: undefined,
  } || undefined,
  StreamDownloadBoolenRecord = undefined,
) {
  try {
    const SpotifyTracksRawData = await getData(Url);
    if (SpotifyTracksRawData.type === 'track') {
      const CacheTrack = await SpotifyTrackExtractor(
        SpotifyTracksRawData,
        YoutubeStreamOptions,
        StreamDownloadBoolenRecord,
      );
      return {
        playlist: false,
        tracks: [CacheTrack],
        error: undefined,
      };
    }
    SpotifyTracksRawData.tracks.items = SpotifyTracksRawData.tracks.items.map(
      (video) => {
        if (video && video.track && video.track.name !== '') return video;
        return void undefined;
      },
    );
    SpotifyTracksRawData.tracks.items = SpotifyTracksRawData.tracks.items.filter(
      Boolean,
    );
    const ProcessedTracks = await Promise.all(
      SpotifyTracksRawData.tracks.items.map(
        async (Track) => await SpotifyTrackExtractor(
          Track,
          YoutubeStreamOptions,
          StreamDownloadBoolenRecord,
        ),
      ),
    );
    return {
      playlist: !!ProcessedTracks[0],
      tracks: ProcessedTracks,
      error: undefined,
    };
  } catch (error) {
    return {
      playlist: false,
      tracks: [],
      error,
    };
  }

  async function SpotifyTrackExtractor(
    SpotifyTrackRawData,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Cookies: undefined,
      Proxy: undefined,
    } || undefined,
    StreamDownloadBoolenRecord = undefined,
  ) {
    const VideoThumbnailPreview = await getPreview(
      (SpotifyTrackRawData.id
        ? `https://open.spotify.com/track/${SpotifyTrackRawData.id}`
        : undefined)
        ?? (SpotifyTrackRawData.track
          ? `https://open.spotify.com/track/${SpotifyTrackRawData.track.id}`
          : undefined),
    );
    const track = {
      Id: 0,
      url:
        (SpotifyTrackRawData.external_urls
          ? SpotifyTrackRawData.external_urls.spotify
          : undefined)
        ?? (SpotifyTrackRawData.track.external_urls
          ? SpotifyTrackRawData.track.external_urls.spotify
          : undefined)
        ?? VideoThumbnailPreview.link
        ?? undefined,
      title:
        SpotifyTrackRawData.name
        ?? (SpotifyTrackRawData.track
          ? SpotifyTrackRawData.track.name
          : undefined)
        ?? VideoThumbnailPreview.title
        ?? undefined,
      video_Id:
        (SpotifyTrackRawData.track
          ? SpotifyTrackRawData.track.id
          : undefined)
        ?? SpotifyTrackRawData.id
        ?? undefined,
      author:
        VideoThumbnailPreview.artist
        ?? (SpotifyTrackRawData.artists
        && SpotifyTrackRawData.artists[0]
        && SpotifyTrackRawData.artists[0].name
          ? SpotifyTrackRawData.artists[0].name
          : SpotifyTrackRawData.track
            && SpotifyTrackRawData.track.artists
            && SpotifyTrackRawData.track.artists[0]
            ? SpotifyTrackRawData.track.artists[0].name
            : undefined)
        ?? undefined,
      author_link:
        (SpotifyTrackRawData.artists
        && SpotifyTrackRawData.artists[0]
        && SpotifyTrackRawData.artists[0].external_urls
          ? SpotifyTrackRawData.artists[0].external_urls.spotify
          : SpotifyTrackRawData.track
            && SpotifyTrackRawData.track.artists
            && SpotifyTrackRawData.track.artists[0]
            ? SpotifyTrackRawData.track.artists[0].external_urls.spotify
            : undefined) ?? undefined,
      description:
        SpotifyTrackRawData.description
        ?? VideoThumbnailPreview.description
        ?? undefined,
      custom_extractor: 'play-dl',
      duration:
        SpotifyTrackRawData.duration_ms
        ?? (SpotifyTrackRawData.track
          ? SpotifyTrackRawData.track.duration_ms
          : undefined)
        ?? undefined,
      orignal_extractor: 'spotify',
      thumbnail: VideoThumbnailPreview.image ?? undefined,
      channelId: undefined,
      channel_url: undefined,
      likes: undefined,
      is_live: false,
      dislikes: undefined,
    };
    const CompleteTracks = await PlayDLExtractor.DataExtractorYoutube(
      `${track.title}`,
      'spotify',
      YoutubeStreamOptions,
      track,
      StreamDownloadBoolenRecord,
    );
    return CompleteTracks[0];
  }
}
module.exports = SpotifyScrapper;
