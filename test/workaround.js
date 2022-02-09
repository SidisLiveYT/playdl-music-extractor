const { StreamDownloader } = require('.././src/index.js')
async function Trail() {
  return console.log(await StreamDownloader('https://music.youtube.com/watch?v=b8m9zhNAgKs&feature=share'))
}
Trail()
