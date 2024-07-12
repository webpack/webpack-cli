import { NodePlopAPI } from "./types";

export default async function (plop: NodePlopAPI) {
  await plop.load("./generators/default.js", {}, true);
  await plop.load("./generators/react.js", {}, true);
}
