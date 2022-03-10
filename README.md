<div align="center">
  <br />
  <br />
  <p>
<h1>PlayDL Music Extractor</h1>
  </p>
</div>

## About

PlayDL Music Extractor is a Extractor/Scrapper and Helps Players to fetch data from play-dl or Custom Extractors , as Per reduces extra work and credentials.

- Auto - UserAgents Method for Ratelimit Issue ( Fixed Youtube [ 429 ] Error )
- Object-oriented , means Value returned in a structure format or Class
- Supports Youtube , Spotify , Reverbnation , SoundCloud , Facebook Urls and Even Youtube Search
- Delay/Buffer Timeout is max 3 seconds on tracks and 7 sec for Playlists
- Customisable Extractors
- Performant
- 100% coverage of play-dl and custom extractors

### Installation

**Node.js 16 or newer is required.**

```
npm install playdl-music-extractor
```

### Example :

#### Fetched Data

```js
  Track {
    trackId: 1,
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    videoId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    description: '“Despacito” disponible ya en todas las plataformas digitales: https://UMLE.lnk.to/DOoUzFp \n' +
      '“Imposible” disponible ya en todas las plataformas digitales: https://UMLE.lnk.to/IMPOSIBLEFp\n' +
      '“Calypso” disponible ya en todas las plataformas digitales: https://UMLE.lnk.to/CLYPSFp\n' +
      'Echame La Culpa disponible ya en todas las plataformas digitales: https://UMLE.lnk.to/ELCFp\n' +
      '\n' +
      '\n' +
      'Best of Luis Fonsi / Lo mejor Luis Fonsi: https://goo.gl/KLWPSa \n' +
      'Subscribe here: https://goo.gl/nkhcGc\n' +
      'Sigue a Luis Fonsi: \n' +
      'Official Site: http://www.luisfonsi.com/ \n' +
      'Facebook: https://www.facebook.com/luisfonsi/ \n' +
      'Twitter: https://twitter.com/LuisFonsi \n' +
      'Instagram: https://www.instagram.com/luisfonsi\n' +
      '\n' +
      '#LuisFonsi #Despacito #Imposible #Calypso #EchamelaCulpa #NadaEsImposible #NothingisImpossible #LF\n' +
      '\n' +
      '\n' +
      'Music video by Luis Fonsi performing Despacito. (C) 2017 Universal Music Latino',
    author: {
      name: 'LuisFonsiVEVO',
      url: 'https://www.youtube.com/channel/UCLp8RBhQHu9wSsq62j_Md6A'
    },
    extractorModel: { orignal: 'youtube', custom: 'play-dl' },
    duration: { ms: 282000, readable: '4 Minutes 42 Seconds' },
    thumbnail: {
      Id: 'kJQP7kiw5Fk',
      url: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCuffhiAPaneh-5dnyfyvY_mDwxhQ'
    },
    channel: {
      name: 'LuisFonsiVEVO',
      Id: 'UCLp8RBhQHu9wSsq62j_Md6A',
      url: 'https://www.youtube.com/channel/UCLp8RBhQHu9wSsq62j_Md6A'
    },
    isLive: false,
    ratings: { likes: 47756817, dislikes: 0 }
  },
```

#### Tips/Base Information :

- _Track Data is instance of Track Class and you can also retrieve Stream Data or Lyrics by getStream(...args) and getLyrics()_
- _Stream will be Processed through Official "play-dl" Npm Package_
- _Besides Official Use of play-dl Package , You can retrieve data from facebook,deezer,reverbnation and vimeo (soon)_

#### Code Snippet :

- [Common JS](example/exampleTest.js)
- [ES Modern](example/esModernExample.js)

#### Supportable Websites :

- [Youtube Example](example/exampleTest.js)
- [Spotify Example](example/exampleTest.js)
- [SoundCloud Example](example/exampleTest.js)
- [Deezer Example](example/exampleTest.js)
- [Reverbnation Example](example/exampleTest.js)
- [Facebook Example](example/exampleTest.js)
- [Vimeo Example (Soon)](example/exampleTest.js)

### Links

- [play-dl](https://www.npmjs.com/package/play-dl)
- [Source Code](https://github.com/SidisLiveYT/playdl-music-extractor.git)
- [GitHub Repo Link](https://github.com/SidisLiveYT/playdl-music-extractor)
- [NPM Package](https://www.npmjs.com/package/playdl-music-extractor)
- [Yarn Package](https://yarn.pm/playdl-music-extractor)

### Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the ReadMe.md

### Help

If you don't understand something in the ReadMe.md , you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Support Server](https://discord.gg/MfME24sJ2a).
