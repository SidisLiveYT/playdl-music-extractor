const { getData, getPreview } = require('spotify-url-info');
const PlayDLExtractor = require('./Track-Extractor');

async function SpotifyScrapper(
  Url,
  YoutubeStreamOptions = {
    Limit: 1,
    Quality: undefined,
    Proxy: undefined,
  } || undefined,
  StreamDownloadBoolenRecord = null,
) {
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
    };
  }

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
    playlist: false,
    tracks: ProcessedTracks,
  };

  async function SpotifyTrackExtractor(
    SpotifyTrackRawData,
    YoutubeStreamOptions = {
      Limit: 1,
      Quality: undefined,
      Proxy: undefined,
    } || undefined,
    StreamDownloadBoolenRecord = null,
  ) {
    const VideoThumbnailPreview = await getPreview(
      SpotifyTrackRawData.external_urls
        ? SpotifyTrackRawData.external_urls.spotify
        : SpotifyTrackRawData.track.external_urls.spotify,
    );
    const track = {
      Id: 0,
      url:
        (SpotifyTrackRawData.external_urls
          ? SpotifyTrackRawData.external_urls.spotify
          : SpotifyTrackRawData.track.external_urls.spotify)
        ?? VideoThumbnailPreview.link
        ?? null,
      title:
        SpotifyTrackRawData.name
        ?? (SpotifyTrackRawData.track ? SpotifyTrackRawData.track.name : null)
        ?? VideoThumbnailPreview.title
        ?? null,
      author:
        (SpotifyTrackRawData.artists && SpotifyTrackRawData.artists[0]
          ? SpotifyTrackRawData.artists[0].name
          : SpotifyTrackRawData.track
            && SpotifyTrackRawData.track.artists
            && SpotifyTrackRawData.track.artists[0]
            ? SpotifyTrackRawData.track.artists[0].name
            : null) ?? null,
      author_link:
        (SpotifyTrackRawData.artists && SpotifyTrackRawData.artists[0]
          ? SpotifyTrackRawData.artists[0].url
          : SpotifyTrackRawData.track
            && SpotifyTrackRawData.track.artists
            && SpotifyTrackRawData.track.artists[0]
            ? SpotifyTrackRawData.track.artists[0].url
            : null) ?? null,
      description:
        SpotifyTrackRawData.description
        ?? VideoThumbnailPreview.description
        ?? null,
      custom_extractor: 'play-dl',
      duration:
        SpotifyTrackRawData.duration_ms
        ?? (SpotifyTrackRawData.track
          ? SpotifyTrackRawData.track.duration_ms
          : null)
        ?? null,
      orignal_extractor: 'spotify',
      thumbnail: VideoThumbnailPreview.image ?? null,
      channelId: null,
      channel_url: null,
      likes: null,
      is_live: false,
      dislikes: null,
    };
    const CompleteTracks = await PlayDLExtractor.DataExtractorYoutube(
      track.title,
      'spotify',
      YoutubeStreamOptions,
      track,
      StreamDownloadBoolenRecord,
    );
    return CompleteTracks[0];
  }
}
module.exports = SpotifyScrapper;
