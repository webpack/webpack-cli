/** @jsx createElement */

const path = require("node:path");

interface Banner {
  tag: string;
  props: { title: string };
}

// `createElement` is consumed through the `@jsx` pragma above
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createElement = (tag: string, props: { title: string }): Banner => ({ tag, props });
const banner: Banner = <div title="quux" />;

const config = {
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename: `${banner.props.title}.bundle.js`,
  },
};

module.exports = config;
