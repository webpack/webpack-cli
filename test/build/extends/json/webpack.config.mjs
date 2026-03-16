import WebpackCLITestPlugin from "../../../utils/webpack-cli-test-plugin.js";

export default () => {
  console.log("derived.webpack.config.js");

  return {
    extends: [import.meta.resolve("./base.webpack.config.json")],
    plugins: [new WebpackCLITestPlugin()],
  };
};
