module.exports = [
  {
    name: "first-config",
    entry: "./src/first.js",
    stats: {
      colors: {
        green: "\u001B[31m", // overwriting with red for test
      },
    },
    mode: "development",
  },
  {
    name: "second-config",
    entry: "./src/second.js",
    stats: {
      colors: {
        green: "\u001B[34m", // overwriting with blue for test
      },
    },
    mode: "development",
  },
];
