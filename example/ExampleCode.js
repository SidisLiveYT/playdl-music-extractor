import { Extractor } from 'playdl-music-extractor'

const TracksData = await Extractor('Despacito', {
  Limit: 1,
  Quality: 'highest',
  Proxy: undefined, //[{"Ip-Address:Port-Number"}] Format(Proxy)
  IgnoreError: true,
})
console.log(TracksData)
console.log(TracksData.tracks)
console.log(TracksData.tracks[0].url)
