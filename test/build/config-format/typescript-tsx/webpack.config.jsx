/** @jsx createElement */

const path = require("node:path");

const createElement = (tag, props) => ({ tag, props });
const banner = <div title="baz" />;

const config = {
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename: `${banner.props.title}.bundle.js`,
  },
};

module.exports = config;
