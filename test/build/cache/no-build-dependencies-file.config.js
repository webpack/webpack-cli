module.exports = {
  name: "no-build-dependencies-file",
  entry: {
    app: "./src/main.js",
  },
  mode: "development",
  cache: {
    type: "filesystem",
  },
  infrastructureLogging: {
    debug: /cache/,
  },
};
