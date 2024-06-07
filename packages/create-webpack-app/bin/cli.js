import { Command } from "commander";
import { resolve, join } from "path";
import nodePlop from "node-plop";
// Cspell:ignore plopfile, plopfile.js

const program = new Command();
const plop = await nodePlop("./lib/plopfile.js");
const defaultValues = {
  init: {
    projectName: "webpack-project",
    projectPath: resolve(join(process.cwd(), ".")),
    langType: "none",
    devServer: true,
    htmlWebpackPlugin: true,
    workboxWebpackPlugin: true,
    cssType: "CSS only",
    isCSS: true,
    isPostCSS: true,
    extractPlugin: "No",
    packageManager: "npm",
  },
};

program.version("1.0.0", "-v, --version");
program.helpOption("-h, --help", "Display help for command");

program
  .command("init")
  .description("Initialize a new Webpack project")
  .option("-s, --skip", "Skip the prompt and use the default values", false)
  .option("-f, --force", "Force the generator actions to override existing files", false)
  .action(function (opts) {
    console.log("Initializing a new Webpack project");
    const { skip, force } = opts;
    const initGenerator = plop.getGenerator("init");
    if (skip) {
      console.log("Skipping the prompt and using the default values");
      initGenerator.runActions(defaultValues.init);
    } else {
      initGenerator.runPrompts([]).then((answers) => {
        initGenerator.runActions(answers);
      });
    }
  });

program.parse();
