const { Client } = require('genius-lyrics');

class LyricsGen {
  /**
   * @private
   * Private property as of Saved Client to handle Ratelimit of Requests
   */
  static #GeniusClient = undefined;

  /**
   * Looks for the data about a song.
   * @public
   * @static
   * @param {string} SongConstant Song's Name or Song Url
   * @param {boolean} force Force to Fetch New Genius Client
   * @param {number} researchCount Re-rearch counts with new Clients
   * @returns {Promise<String|undefined>|undefined} Lyrics as String Value
   */
  static async GetLyrics(SongConstant, force = false, researchCount = 0) {
    if (!SongConstant) return void null;
    try {
      LyricsGen.#GeniusClient = !force && researchCount !== 0 && LyricsGen.#GeniusClient
        ? LyricsGen.#GeniusClient ?? undefined
        : new Client();

      return await (
        await LyricsGen.#GeniusClient.songs.search(`${SongConstant}`)
      )[0].lyrics();
    } catch (error) {
      if (researchCount <= 0) return void null;
      researchCount -= 1;
      return await LyricsGen.GetLyrics(SongConstant, true, researchCount);
    }
  }
}

module.exports = LyricsGen;
