import { WebpackCLILogger } from "webpack-cli";
import { green, yellow, Color, red, cyan, cyanBright, blue, blueBright } from "colorette";
import { PlopActionHooksChanges, PlopActionHooksFailures } from "../types";
import { relative } from "path";

const prefix: string = blueBright("create-webpack");
const getLogger = (): WebpackCLILogger => {
  return {
    error: (val) => console.error(`[${prefix}] ⛔${red(val)}`),
    warn: (val) => console.warn(`[${prefix}] ⚠️${yellow(val)}`),
    info: (val) => console.info(`[${prefix}] ℹ️ ${cyan(val)}`),
    success: (val) => console.log(`[${prefix}] ✅ ${green(val)}`),
    log: (val) => console.log(`[${prefix}] 📃${val}`),
    raw: (val) => console.log(val),
  };
};
const logger = getLogger();
const typeDisplay: Record<string, Color | string> = {
  function: yellow("-> "),
  add: green("create "),
  addMany: green("create "),
  modify: `${blue("modify")}${green("+")}${red("- ")}`,
  append: green("append_+ "),
  skip: cyanBright("skip-- "),
};
function onSuccessHandler(change: PlopActionHooksChanges): void {
  change.path.split("\n").forEach((line, idx) => {
    if (change.type === "addMany" && idx === 0) {
      return;
    }
    const prefix = typeDisplay[change.type] || "";
    console.log(`\t${prefix} ${relative(process.cwd(), line)}`);
  });
}
function onFailureHandler(failure: PlopActionHooksFailures): void {
  throw new Error(failure.error);
}

export { logger, onSuccessHandler, onFailureHandler };
