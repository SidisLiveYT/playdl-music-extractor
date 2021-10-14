const { getData, getPreview } = require('spotify-url-info');
const YTDLExtractor = require('./Track-Extractor');

async function SpotifyScrapper(Url) {
  const SpotifyTracksRawData = await getData(Url);
  if (SpotifyTracksRawData.type === 'track') {
    const CacheTrack = await SpotifyTrackExtractor(SpotifyTracksRawData);
    return {
      playlist: false,
      tracks: [CacheTrack],
    };
  }

  const ProcessedTracks = await Promise.all(
    SpotifyTracksRawData.tracks.items.map(
      async (Track) => await SpotifyTrackExtractor(Track),
    ),
  );

  return {
    playlist: false,
    tracks: ProcessedTracks,
  };

  async function SpotifyTrackExtractor(SpotifyTrackRawData) {
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
        SpotifyTrackRawData.artists && SpotifyTrackRawData.artists[0]
          ? SpotifyTrackRawData.artists[0].name
          : (SpotifyTrackRawData.track
            && SpotifyTrackRawData.track.artists
            && SpotifyTrackRawData.track.artists[0]
            ? SpotifyTrackRawData.track.artists[0].name
            : null) ?? null,
      author_link:
        SpotifyTrackRawData.artists && SpotifyTrackRawData.artists[0]
          ? SpotifyTrackRawData.artists[0].url
          : (SpotifyTrackRawData.track
            && SpotifyTrackRawData.track.artists
            && SpotifyTrackRawData.track.artists[0]
            ? SpotifyTrackRawData.track.artists[0].url
            : null) ?? null,
      description:
        SpotifyTrackRawData.description
        ?? VideoThumbnailPreview.description
        ?? null,
      custom_extractor: 'youtube-dl',
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
    const CompleteTracks = await YTDLExtractor(track.title, 'spotify', track);
    return CompleteTracks;
  }
}
module.exports = SpotifyScrapper;
