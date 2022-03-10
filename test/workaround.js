const playdl = require('../src/index')

const quickHandler = playdl.playdlQuick

quickHandler.on('tracks', (...eventData) => console.log(eventData))

new Promise(async (resolve, reject) => {
  resolve(
    quickHandler.exec(
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      { streamDownload: true, fetchOptions: { fetchLimit: 1 } },
    ),
  )
})
