<div align="center">
  <br />
  <br />
  <p>
<h1>PlayDL Music Extractor</h1>
  </p>
</div>

## About

PlayDL Music Extractor is a Extractor/Scrapper and Helps Players to fetch data from play-dl or Custom Extractors , as Per reduces extra work and credentials.

- Object-oriented , means Value returned in a structure format
- Supports Youtube , Spotify , Reverbnation , SoundCloud , Facebook Urls and Even Youtube Search
- Delay/Buffer Timeout is max 3 seconds on tracks and 7 sec for Playlists
- Customisable Extractors
- Performant
- 100% coverage of play-dl and custom extractors

## Installation

**Node.js 16 or newer is required.**

```
npm install playdl-music-extractor
```

## Example usage

Extractor Video/Playlist/Album Data from any Platform :-

```
const { Extractor, StreamDownloader , HumanTimeConversion } = require('playdl-music-extractor') //For CommonJS
                            OR
import { Extractor, StreamDownloader , HumanTimeConversion } from 'playdl-music-extractor' //for ES6


var Data = await Extractor(Url || Query, {
  Limit: 1,
  Quality: 'highest',
  Cookies: undefined, //YT Cookies Headers in String form
  Proxy: undefined, //[{"Ip-Address:Port-Number"}] Format(Proxy)
  IgnoreError: true,
})

if(Data.error) throw Data.error;


var StreamData = await StreamDownloader(Url || Query, {
  Limit: 1,
  Quality: 'highest',
  Cookies: undefined, //YT Cookies Headers in String form
  Proxy: undefined, //[{"Ip-Address:Port-Number"}] Format(Proxy)
  IgnoreError: true,
})

if(StreamData.error) throw StreamData.error;


var HumanTime = HumanTimeConversion(Milliseconds)
```

## Strucutre of Data/Track

```
Data : {
  playlist : Boolean,
  tracks : [
    {
      Id: 0,
      url: null,
      title: null,
      author: null,
      author_link: null,
      description: null,
      custom_extractor: `youtube-dl`,
      duration: 0,
      human_duration: undefined,
      preview_stream_url: null,
      stream: null,
      stream_type: undefined,
      stream_duration: 0,
      stream_video_Id: undefined,
      stream_human_duration: undefined,
      orignal_extractor: null | 'youtube' | 'spotify' | 'facebook' | 'arbitrary',
      thumbnail: null,
      channelId: 'none' | 0,
      channel_url: null,
      likes: 0,
      is_live: false,
      dislikes: 0,
    }
  ],
  error : Error | undefined
}
```

- `Extractor() is same as StreamDownloader() but it will not download info related to Streams like - "stream","stream_type" and e.t.c , just the info about the Query`
- `"<Track>.stream_duration" is Stream Duration in Milliseconds as Stream is from Youtube`
- `Data.tracks[0].stream can be used in terms of stream value in @discordjs/voice or any other Audio package After using - StreamDownloader() .`

## Use-Case for @discordjs/voice Package

```
const { StreamDownloader } = require('playdl-music-extractor')
const { createAudioResource } = require('@discordjs/voice')

const Data = await StreamDownloader('Despacito', {
  Limit: 1,
  Quality: 'highest',
  Cookies: undefined, //YT Cookies Headers in String form
  Proxy: undefined, //[{"Ip-Address:Port-Number"}] Format(Proxy)
  IgnoreError: true,
})

if(Data.error) throw Data.error;

var Audio_Resource = createAudioResource(Data.tracks[0].stream ,{
  inputType: Data.tracks[0].stream_type
})


/*

- Rest is mentioned in @discordjs/voice examples , from here "Audio_Resource" is important
- Extractor() is same as StreamDownloader() but it will not download info related to Streams like - "stream","stream_type" and e.t.c , just the info about the Query

*/

```

## Links

- [play-dl](https://www.npmjs.com/package/play-dl)
- [Source Code](https://github.com/SidisLiveYT/playdl-music-extractor.git)
- [GitHub Repo Link](https://github.com/SidisLiveYT/playdl-music-extractor)
- [NPM Package](https://www.npmjs.com/package/playdl-music-extractor)
- [Yarn Package](https://yarn.pm/playdl-music-extractor)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the ReadMe.md

## Help

If you don't understand something in the ReadMe.md , you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Support Server](https://discord.gg/Vkmzffpjny).
