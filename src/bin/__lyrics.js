const lyricsFinder = require('lyrics-finder');

class lyrics {
  /**
   * Looks for the data about a song.
   * @static
   * @param {string} __songConstant Song's Name
   * @param {string} __artistConstant Song's Artist Name
   * @returns {Promise<String|undefined>|undefined} Lyrics as String Value
   */
  static async getLyrics(__songConstant, __artistConstant) {
    if (
      !(
        __songConstant
        && typeof __songConstant === 'string'
        && __songConstant !== ''
      )
      || !(
        __artistConstant
        && typeof __artistConstant === 'string'
        && __artistConstant !== ''
      )
    ) return undefined;

    return await lyricsFinder(__artistConstant, __songConstant);
  }
}

module.exports = lyrics;
