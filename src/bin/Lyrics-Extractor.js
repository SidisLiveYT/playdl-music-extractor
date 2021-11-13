const axios = require('axios');

class Lyrics {
  /**
   * Looks for the data about a song.
   * @public
   * @static
   * @param {string} SongName Song's Name
   */
  static async GetLyrics(SongName) {
    return await axios({
      method: 'get',
      url: `http://api.deezer.com/search?limit=5&q=${encodeURIComponent(SongName)}`,
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(async (response) => await axios({
        method: 'get',
        url: `https://api.lyrics.ovh/v1/${encodeURIComponent(
          response.data.data[0].artist.name,
        )}/${encodeURIComponent(response.data.data[0].title)}`,
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.data)
        .catch((error) => void null))
      .catch((error) => void null);
  }
}

module.exports = Lyrics;
