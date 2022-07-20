const { playdl } = require("../src/index");

const quickHandler = playdl.playdlQuick;

quickHandler.on("track", (...eventData) => console.log(eventData));

new Promise(async (resolve, reject) => {
  resolve(
    quickHandler.softExtractor("Despacito", {
      fetchOptions: { fetchLimit: 1 },
    })
  );
  resolve(
    quickHandler.streamExtractor(
      "https://open.spotify.com/track/09gysnJpfQ3ublBmJDfcEC?si=fe59e6de5968420d",
      {
        fetchOptions: { fetchLimit: 1 },
      },
      "tracks"
    )
  );
  resolve(
    quickHandler.exec("Despacito", {
      fetchOptions: { fetchLimit: 1 },
    })
  );
});
