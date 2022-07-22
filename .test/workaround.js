const playdl = require("../src/index");

const quickHandler = playdl.playdlQuick;

quickHandler.on("playlist", (...eventData) =>
  console.log(`Playlist :\n`, eventData)
);
quickHandler.on("track", (...eventData) =>
  console.log(`Track :\n`, eventData[2])
);

new Promise(async (resolve, reject) => {
  //console.log(
  await quickHandler.exec("Despacito", {
    streamDownload: true,
    eventReturn: { metadata: { data: "random-Data" } },
  });
  //);
});
