import {
  Extractor,
  StreamDownloader,
  HumanTimeConversion,
} from 'playdl-music-extractor'

const TracksData = await Extractor('Despacito', {
  Limit: 1,
  Quality: 'highest',
  UserAgents: undefined, //[{"Mozilla/5.0 (Windows NT 10.0; Win64; x64) ....."}] Format(UserAgents)
  IgnoreError: true,
})

if(TracksData.error) throw TracksData.error;

console.log(TracksData)
console.log(TracksData.tracks)
console.log(TracksData.tracks[0].url)


const TracksData = await StreamDownloader('Despacito', {
  Limit: 1,
  Quality: 'highest',
  UserAgents: undefined, //[{"Mozilla/5.0 (Windows NT 10.0; Win64; x64) ....."}] Format(UserAgents)
  IgnoreError: true,
})

if(TracksData.error) throw TracksData.error;

console.log(TracksData)
console.log(TracksData.tracks)
console.log(TracksData.tracks[0].stream)

console.log(HumanTimeConversion(60000)) //Will Convert milli Seconds to Human language "en" Time