const playdl = require("../src/index");

const quickHandler = playdl.playdlQuick;

quickHandler.on("tracks", (...eventData) => console.log(eventData));

new Promise(async (resolve, reject) => {
  resolve(
    quickHandler.exec(
      "https://open.spotify.com/playlist/37i9dQZF1DX5Ejj0EkURtP?si=c74c1b51b1b74ec9",
      { streamDownload: true }
    )
  );
});
