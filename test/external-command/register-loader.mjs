import nodeModule from "node:module";
import { pathToFileURL } from "node:url";
import { resolveSync } from "./my-loader.mjs";

// `module.register()` is deprecated (DEP0205) since Node.js 26,
// fallback to it only for Node.js versions without `module.registerHooks()`
if (typeof nodeModule.registerHooks === "function") {
  nodeModule.registerHooks({ resolve: resolveSync });
} else {
  nodeModule.register("./my-loader.mjs", pathToFileURL("./"));
}
