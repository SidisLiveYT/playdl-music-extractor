/**
 * @class Album  Album is a Class used for Patching album Info with Ids and attached with Tracks
 */

class Album {
  /**
   * @static @property {Object[]} cachedIds  Cached album Ids for fetching Related album data
   */
  static cachedIds = [];

  /**
   *
   * @param {Number | String | undefined} customId  Custom Id for replaceing Indexing Id as a default and place for given Ids in Cache
   * @param {Object<any>} metadata  Metadata for patching with defaulter and fetch only required data " termed as raw Metadata for parsing"
   * @param {Number} tracksCount  Tracks Count for album Metadata and tracking of Tracks fetched from extractors
   */
  constructor(customId, metadata, tracksCount, customMetadata = undefined) {
    /**
     * @property {number | string | undefined} Id  public property and consist of unique album id and attached with Tracks for Fetching proper album Data
     */
    this.Id = this.#getId(
      customId ?? metadata?.id ?? (Album.cachedIds?.length ?? 0) + 1,
    );
    Album.cachedIds[this.Id] = this.patch({
      ...metadata,
      metadata: customMetadata,
      tracksCount,
    });
  }

  /**
   * @static
   * @param {Object<any>} albumMetadata  Metadata for patching with defaulter and fetch only required data " termed as raw Metadata for parsing"
   * @param {number} tracksCount  Tracks Count for album Metadata and tracking of Tracks fetched from extractors
   * @param {any} cacheMain  cachedMain Instance for events Trigger
   * @param {boolean | true} eventTrigger  default (True) | Used for Triggering album Event on cachedMain instance
   * @returns {string | number | undefined} Returns Id of the Album Instance this.Id value
   */
  static generate(
    albumMetadata,
    tracksCount,
    cacheMain,
    eventTrigger = true,
    metadata = undefined,
  ) {
    const album = new Album(undefined, albumMetadata, tracksCount, metadata);
    if (eventTrigger) cacheMain.emit('album', album);
    return album?.Id;
  }

  /**
   * @static @method get get static Method for getting cached Album Instance related to given Id
   * @param {string | number | undefined} Id Given Id for related Album Instance saved to Caches
   * @returns {Album | undefined} Returns Album Instance only if its present or undefined
   */
  static get(Id) {
    return Album.cachedIds[Id];
  }

  /**
   * @method patch Patching Raw Album/album Data
   * @param {Object<any>} metadata Metadata Data for Patching
   * @returns {this} Returns Modified Data
   */
  patch(metadata) {
    this.name = metadata?.name ?? metadata?.title;
    this.tracksCount = metadata.tracksCount;
    this.url = metadata?.external_urls?.spotify ?? metadata?.url;
    this.description = metadata?.description;
    this.thumbnail = metadata?.images?.[0]?.url
      ?? metadata?.thumbnail?.url
      ?? metadata?.thumbnail;
    this.channel = metadata?.channel || metadata?.owner || metadata?.author
        ? {
            name:
              metadata?.channel?.name
              ?? metadata?.channel?.title
              ?? metadata?.owner?.display_name
              ?? metadata?.author?.name
              ?? metadata?.author?.username,
            description:
              metadata?.channel?.description ?? metadata?.owner?.description,
            url:
              metadata?.channel?.url
              ?? metadata?.owner?.external_urls?.spotify
              ?? metadata?.author?.profile,
            thumbnail: metadata?.channel?.icons?.[0]?.url,
          }
        : undefined;
    this.views = metadata?.views;
    this.metadata = metadata?.metadata;
    return this;
  }

  /**
   * @method @private
   * @param {string | number | undefined} customId Check for Correct Id for Caching with While loops Check
   * @returns {string | number | undefined} Returns Id for this.id value
   */
  #getId(customId) {
    while (Album.cachedIds[customId]) {
      customId = Math.random().toString(16).substring(2, 14);
    }

    return customId;
  }
}

module.exports = Album;
