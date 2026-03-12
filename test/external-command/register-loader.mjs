import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./my-loader.mjs", pathToFileURL("./"));
