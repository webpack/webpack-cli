import { normalize, relative } from "node:path";
import { type Color, blue, blueBright, cyan, green, greenBright, red, yellow } from "colorette";
import {
  type Logger,
  type PlopActionHooksChanges,
  type PlopActionHooksFailures,
} from "../types.js";

const prefix: string = blueBright("create-webpack");
const getLogger = (): Logger => ({
  error: (val) => console.error(`[${prefix}] ⛔${red(val)}`),
  warn: (val) => console.warn(`[${prefix}] ⚠️${yellow(val)}`),
  info: (val) => console.info(`[${prefix}] ℹ️ ${cyan(val)}`),
  success: (val) => console.log(`[${prefix}] ✅ ${green(val)}`),
  log: (val) => console.log(`[${prefix}] 📃${val}`),
  raw: (val) => console.log(val),
});
const logger = getLogger();

const typeDisplay: Record<string, Color | string> = {
  function: yellow("-> "),
  add: green("create "),
  addMany: green("create "),
  modify: `${blue("modify")}${green("+")}${red("- ")}`,
  overwrite: red("overwrite "),
  append: green("append_+ "),
  skip: yellow("skip "),
  identical: greenBright("identical "),
  create: green("create "),
};

function onSuccessHandler(change: PlopActionHooksChanges): void {
  switch (change.type) {
    case "generate-files": {
      for (const line of change.path.split("\n")) {
        const [operationType = "", renderPath = ""] = line.split("|");
        console.log(
          `\t${typeDisplay[operationType]} ${normalize(relative(process.cwd(), renderPath))}`,
        );
      }
      break;
    }
    case "install-dependencies": {
      logger.success(change.path);
      break;
    }
  }
}

function onFailureHandler(failure: PlopActionHooksFailures): void {
  throw new Error(failure.error);
}

export { logger, onFailureHandler, onSuccessHandler };
