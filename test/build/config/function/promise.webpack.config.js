module.exports = new Promise((resolve) => {
  resolve({
    output: {
      filename: "./promise-single.js",
    },
    name: "promise-single",
    mode: "development",
  });
});
