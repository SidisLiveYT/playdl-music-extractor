const { validate } = require('play-dl')
const PlayDLExtractor = require('./Track-Extractor')

async function QueryResolver(Query) {
  const YoutubeUrlRegex = /^.*(youtu.be\/|list=|watch=|v=)([^#\&\?]*).*/
  const ValidateUrlResult = await validate(Query)
  const YoutubeTracks = {
    playlist:
      !ValidateUrlResult ??
      ValidateUrlResult.includes('playlist') ??
      ValidateUrlResult.includes('album') ??
      false,
    tracks:
      Query.match(YoutubeUrlRegex) &&
      ValidateUrlResult &&
      (ValidateUrlResult.includes('playlist') ||
        ValidateUrlResult.includes('album'))
        ? await PlayDLExtractor.DataExtractorYoutube(Query)
        : await PlayDLExtractor.DataExtractorYoutube(Query),
  }
  return YoutubeTracks
}

module.exports = QueryResolver
