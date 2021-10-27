import {
  Extractor,
  StreamDownloader,
  HumanTimeConversion,
} from 'playdl-music-extractor'

const TracksData = await Extractor('Despacito', {
  Limit: 1,
  Quality: 'highest',
  Proxy: undefined, //[{"Ip-Address:Port-Number"}] Format(Proxy)
  IgnoreError: true,
})

if(TracksData.error) throw TracksData.error;

console.log(TracksData)
console.log(TracksData.tracks)
console.log(TracksData.tracks[0].url)


const TracksData = await StreamDownloader('Despacito', {
  Limit: 1,
  Quality: 'highest',
  Proxy: undefined, //[{"Ip-Address:Port-Number"}] Format(Proxy)
  IgnoreError: true,
})

if(TracksData.error) throw TracksData.error;

console.log(TracksData)
console.log(TracksData.tracks)
console.log(TracksData.tracks[0].stream)

console.log(HumanTimeConversion(60000)) //Will Convert milli Seconds to Human language "en" Time
