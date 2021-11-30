import yeoman from "yeoman-environment";
import { Command } from "commander";
import InitGenerator from "./init-generator";
import util from "util";
import { createColors, isColorSupported } from "colorette";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLogger(colors: any) {
  return {
    error: (val: string) => console.error(`[create-webpack-app] ${colors.red(util.format(val))}`),
    warn: (val: string) => console.warn(`[create-webpack-app] ${colors.yellow(val)}`),
    info: (val: string) => console.info(`[create-webpack-app] ${colors.cyan(val)}`),
    success: (val: string) => console.log(`[create-webpack-app] ${colors.green(val)}`),
    log: (val: string) => console.log(`[create-webpack-app] ${val}`),
    raw: (val: string) => console.log(val),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getColors(useColor?: any) {
  let shouldUseColor;

  if (useColor) {
    shouldUseColor = useColor;
  } else {
    shouldUseColor = isColorSupported;
  }

  return { ...createColors({ useColor: shouldUseColor }), isColorSupported: shouldUseColor };
}

function getOptions() {
  const program = new Command();

  program.name("create-webpack-app");
  program.description("create new webpack project", {
    "generation-path": "Path to the installation directory, e.g. ./projectName",
  });
  program.usage("[generation-path] [options]");
  program.option("-t, --template [type]", "Type of template", "default");
  program.option("-f, --force", "Generate without questions (ideally) using default answers");

  program.parse();

  return program.opts();
}

export default function (): void {
  const colors = getColors();
  const logger = getLogger(colors);
  const { generationPath, options } = getOptions();

  options.generationPath = generationPath || ".";

  const env = yeoman.createEnv([], {
    cwd: options.generationPath,
  });
  const generatorName = "webpack-init-generator";

  env.registerStub(InitGenerator, generatorName);

  env.run(generatorName, { cli: { colors, logger }, options }, () => {
    logger.success("Project has been initialised with webpack!");
  });
}
