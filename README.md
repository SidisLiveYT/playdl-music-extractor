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
- Python Based Browser Extrator -> Need to have Python installed in binary \$PATH
- Supports 700+ Website's Urls and Even Youtube Search
- Delay/Buffer Timeout is max 3 seconds on tracks and 7 sec for Playlists
- Customisable Extractors
- Performant
- 100% coverage of youtube-dl and custom extractors

## Installation

**Node.js 16 or newer is required.**

```
npm install playdl-music-extractor
```

## Example usage

Extractor Video/Playlist/Album Data from any Platform :-

```
const { Extractor } = require('playdl-music-extractor') //For CommonJS
                            OR
import { Extractor } from 'playdl-music-extractor' //for ES6


var Data = await Extractor(Url || Query)
```

## Strucutre of Data/Track

```
Data : {
  playlist : Boolean,
  tracks : [
    {
      Id: 0,
      url: String,
      title: String,
      author: String,
      author_link: String,
      description: String,
      custom_extractor: `youtube-dl`,
      duration: 0,
      stream: String,
      stream_type: String,
      orignal_extractor: 'youtube' | 'spotify' | 'facebook' | 'arbitary',
      thumbnail: String,
      channelId: 0 || String,
      channel_url: String,
      likes: 0,
      is_live: false,
      dislikes: 0,
}]
}
```

- `Data.tracks[0].stream can be used in terms of stream value in @discordjs/voice or any other Audio package .`

## Use-Case for @discordjs/voice Package

```
const { Extractor } = require('playdl-music-extractor')
const { createAudioResource } = require('@discordjs/voice')

var Data = await Extractor(Url || "Despacito" , {
  Limit: 1,
  Quality: 'highest',
  Proxy: ["IP's Domain:PortNumber"],
  }
)

var Audio_Resource = createAudioResource(Data.tracks[0].stream ,{
  inputType: Data.tracks[0].stream_type
})

//Rest is mentioned in @discordjs/voice examples , from here "Audio_Resource" is important

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
