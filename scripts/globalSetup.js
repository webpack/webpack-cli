const { version } = require("webpack");

module.exports = () =>
  console.log(`\n Running tests for webpack @${version} \n NODE_PATH-> ${process.env.NODE_PATH}`);
