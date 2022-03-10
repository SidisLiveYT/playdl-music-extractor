import { playdlQuick } from '../src/index.mjs'

const quickHandler = playdlQuick

quickHandler.on('tracks', (...eventData) => console.log(eventData))

new Promise(async (resolve, reject) => {
  resolve(
    quickHandler.softExtractor('Despacito', {
      fetchOptions: { fetchLimit: 1 },
    }),
  )
  resolve(
    quickHandler.streamExtractor(
      'https://open.spotify.com/track/1SOClUWhOi8vHZYMz3GluK?si=3c010c9df65a4552',
      {
        fetchOptions: { fetchLimit: 1 },
      },
      'tracks',
    ),
  )
  resolve(
    quickHandler.softExtractor('Despacito', {
      fetchOptions: { fetchLimit: 1 },
    }),
  )
})
