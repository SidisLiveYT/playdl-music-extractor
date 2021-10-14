import { Extractor } from '../src/index.mjs'

const TracksData = await Extractor('Despacito')
console.log(TracksData)
console.log(TracksData.tracks)
console.log(TracksData.tracks[0].url)
