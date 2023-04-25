module.exports = () => {
  console.log("base1.webpack.config.js");

  return {
    extends: ["./base2.webpack.config.js"],
    mode: "production",
    entry: "./src/index1.js",
    output: {
      filename: "bundle1.js",
    },
  };
};
