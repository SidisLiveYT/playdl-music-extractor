<div align="center">
  <br />
  <br />
  <p>
<h1>PlayDL Music Extractor</h1>
  </p>
</div>

## About

_PlayDL Music Extractor is a Extractor/Scrapper and Helps Players to fetch data from play-dl or Custom Extractors , as Per reduces extra work and credentials._

- Auto - UserAgents Method for Ratelimit Issue ( Fixed Youtube [ 429 ] Error )
- Supports User-Agents and Youtube Cookies for Stream and Extractor Method
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

#### Example : Fetched Data with Stream and Lyrics

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
    ratings: { likes: 47759879, dislikes: 0 },
    stream: {
      buffer: [Readable],
      videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      type: 'webm/opus',
      duration: [Object],
      videoId: 'kJQP7kiw5Fk'
    },
    lyrics: 'Come and move that in my direction\n' +
      "So thankful for that, it's such a blessin', yeah\n" +
      'Turn every situation into heaven, yeah\n' +
      'Oh-oh, you are\n' +
      'My sunrise on the darkest day\n' +
      "Got me feelin' some kind of way\n" +
      'Make me wanna savor every moment slowly\n' +
      'You fit me tailor-made, love how you put it on\n' +
      'Got the only key, know how to turn it on\n' +
      'The way you nibble on my ear, the only words I wanna hear\n' +
      'Baby, take it slow so we can last long\n' +
      '\n' +
      'Tú, tú eres el imán y yo soy el metal\n' +
      'Me voy acercando y voy armando el plan\n' +
      'Sólo con pensarlo se acelera el pulso\n' +
      'Ya, ya me está gustando más de lo normal\n' +
      'Todos mis sentidos van pidiendo más\n' +
      'Esto hay que tomarlo sin ningún apuro\n' +
      '\n' +
      'Despacito\n' +
      'Quiero respirar tu cuello despacito\n' +
      'Deja que te diga cosas al oído\n' +
      'Para que te acuerdes si no estás conmigo\n' +
      '\n' +
      'Despacito\n' +
      'Quiero desnudarte a besos despacito\n' +
      'Firmo en las paredes de tu laberinto\n' +
      'Y hacer de tu cuerpo todo un manuscrito\n' +
      '\n' +
      'Quiero ver bailar tu pelo, quiero ser tu ritmo\n' +
      'Que le enseñes a mi boca\n' +
      'Tus lugares favoritos\n' +
      'Déjame sobrepasar tus zonas de peligro\n' +
      'Hasta provocar tus gritos\n' +
      'Y que olvides tu apellido\n' +
      'Pasito a pasito, suave suavecito\n' +
      'Nos vamos pegando, poquito a poquito\n' +
      'Cuando tú me besas con esa destreza\n' +
      'Veo que eres malicia con delicadeza\n' +
      'Pasito a pasito, suave suavecito\n' +
      'Nos vamos pegando, poquito a poquito\n' +
      'Y es que esa belleza es un rompecabezas\n' +
      "Pero pa' montarlo aquí tengo la pieza\n" +
      '\n' +
      'Despacito\n' +
      'Quiero respirar tu cuello despacito\n' +
      'Deja que te diga cosas al oído\n' +
      'Para que te acuerdes si no estás conmigo\n' +
      '\n' +
      'Despacito\n' +
      'Quiero desnudarte a besos despacito\n' +
      'Firmo en las paredes de tu laberinto\n' +
      'Y hacer de tu cuerpo todo un manuscrito\n' +
      '\n' +
      'Pasito a pasito, suave suavecito\n' +
      'Nos vamos pegando, poquito a poquito\n' +
      'Que le enseñes a mi boca\n' +
      'Tus lugares favoritos\n' +
      'Pasito a pasito, suave suavecito\n' +
      'Nos vamos pegando, poquito a poquito\n' +
      'Hasta provocar tus gritos\n' +
      'Y que olvides tu apellido\n' +
      'Despacito'
  },
```

#### Tips/Base Information :

- _Track Data is instance of Track Class and you can also retrieve Stream Data or Lyrics by getStream(...args) and getLyrics()_
- _Stream will be Processed through Official "play-dl" Npm Package_
- _Besides Official Use of play-dl Package , You can retrieve data from facebook,deezer,reverbnation and vimeo (soon)_

#### Methods :

- **new playdl.streamExtractor()** OR **playdlQuick.streamExtractor()**
- **new playdl.softExtractor()** OR **playdlQuick.softExtractor()**
- **new playdl.exec()** OR **playdlQuick.exec()**

##### Option's Scheme :

```ts
declare type secretTokens = {
  spotify: {
    client_id: string | number;
    client_secret: string | number;
    refresh_token: string | number;
    market: string | "US";
  };
  soundcloud: { client_id: string | number };
};

declare type fetchOptions = {
  tokens: secretTokens;
  fetchLimit: number;
  streamQuality: string;
  rawCookies: string;
  userAgents: string[];
};

declare type __scrapperOptions = {
  fetchLyrics: boolean | "true";
  eventReturn: { metadata: any };
  ratelimit: number;
  ignoreInternalError: boolean | "true";
  fetchOptions: fetchOptions;
  streamDownload: boolean | "false";
};

declare type extractorData = {
  album: boolean;
  tracks: Array<Track>;
};
```

#### Code Examples :

- [Common JS](example/exampleTest.js)
- [ES Modern](example/esModernExample.mjs)

#### Code Snippet :

```js
const { playdl } = require("playdl-music-extractor");

const quickHandler = new playdl();

quickHandler.on("track", (...eventData) => console.log(eventData));

new Promise(async (resolve, reject) => {
  resolve(
    quickHandler.softExtractor("Despacito", {
      fetchOptions: { fetchLimit: 1 },
    })
  );
  resolve(
    quickHandler.streamExtractor(
      "https://open.spotify.com/track/1SOClUWhOi8vHZYMz3GluK?si=3c010c9df65a4552",
      {
        fetchOptions: { fetchLimit: 1 },
      },
      "tracks"
    )
  );
  resolve(
    quickHandler.exec("Despacito", {
      fetchOptions: { fetchLimit: 1 },
    })
  );
});
```

#### Some Minor Usages :

###### Raw Cookies option :

```js
playdl.exec("Despacito", {
  fetchOptions: {
    rawCookies:
      "xxx-youtubeCookies-from-network-inspect-of-youtubeHomePage-xxx",
  },
});
```

###### User Agents option :

```js
playdl.exec("Despacito", {
  fetchOptions: {
    userAgents: [
      "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
    ],
  },
});
```

#### Supportable Websites Links :

- [Youtube Example](https://www.youtube.com/watch?v=kJQP7kiw5Fk)
- [Spotify Example](https://open.spotify.com/track/1SOClUWhOi8vHZYMz3GluK?si=a9e9d82a9a584f48)
- [SoundCloud Example](https://soundcloud.com/rd-urbansmusic/despacito-luis-fonsi-daddy-yankee)
- [Deezer Example](https://deezer.page.link/cHcZ5zc6u6Rzszq66)
- [Reverbnation Example](https://www.reverbnation.com/♫mp3download/song/12423967-tara-missing-you)
- [Facebook Example](https://www.facebook.com/EpochTimesTrending/videos/310155606660409)
- [Arbitary Example](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3)
- [Vimeo Example (Soon)](https://vimeo.com/684302493)

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
