import { type NodePlopAPI } from "node-plop";

export default async function plopfile(plop: NodePlopAPI) {
  // init generators
  await plop.load("./generators/init/default.js", {}, true);
  await plop.load("./generators/init/react.js", {}, true);
  await plop.load("./generators/init/vue.js", {}, true);
  await plop.load("./generators/init/svelte.js", {}, true);
  await plop.load("./generators/init/webpack.js", {}, true);

  // loader generators
  await plop.load("./generators/loader/default.js", {}, true);

  // plugin generators
  await plop.load("./generators/plugin/default.js", {}, true);
}
