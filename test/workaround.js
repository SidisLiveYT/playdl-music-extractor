const { StreamDownloader } = require('.././src/index.js')
async function Trail() {
  return console.log(await StreamDownloader('Despacito'))
}
Trail()
