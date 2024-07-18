import { NodePlopAPI } from "./types";

export default async function (plop: NodePlopAPI) {
  await plop.load("./generators/init/default.js", {}, true);
  await plop.load("./generators/init/react.js", {}, true);
}
