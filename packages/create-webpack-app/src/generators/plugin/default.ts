import { type Answers, type ActionType, type FileRecord } from "../../types";
import { type NodePlopAPI, type DynamicActionsFunction } from "node-plop";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { logger } from "../../utils/logger.js";

export default async function (plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: Array<string> = ["webpack-defaults"];

  await plop.load("../../utils/pkgInstallAction.js", {}, true);
  await plop.load("../../utils/fileGenerator.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));

  // Define a base generator for the project structure
  plop.setGenerator("plugin-default", {
    description: "Create a basic webpack plugin.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Plugin name?",
        default: "my-webpack-plugin",
        filter: (input) => plop.getHelper("kebabCase")(input),
        validate: (str: string): boolean => str.length > 0,
      },
      {
        type: "list",
        name: "packageManager",
        message: "Pick a package manager:",
        choices: ["npm", "yarn", "pnpm"],
        default: "npm",
        validate(input) {
          if (!input.trim()) {
            return "Package manager cannot be empty";
          }
          return true;
        },
      },
    ],
    actions: function (answers: Answers) {
      const actions: ActionType[] = [];
      answers.projectPath = join(answers.projectPath, answers.name);

      logger.error(`
				Your project must be inside a folder named ${answers.name}
				I will create this folder for you.
                `);

      answers.pluginIdentifier = plop.getHelper("pascalCase")(answers.name);

      const files: Array<FileRecord> = [
        { filePath: "./package.json", fileType: "text" },
        { filePath: "./examples/simple/src/index.js", fileType: "text" },
        { filePath: "./examples/simple/src/lazy-module.js", fileType: "text" },
        { filePath: "./examples/simple/src/static-esm-module.js", fileType: "text" },
        { filePath: "./examples/simple/webpack.config.js", fileType: "text" },
        { filePath: "./src/cjs.js", fileType: "text" },
        { filePath: "./test/fixtures/simple-file.js", fileType: "text" },
        { filePath: "./test/functional.test.js", fileType: "text" },
        { filePath: "./test/test-utils.js", fileType: "text" },
        { filePath: "./src/index.js", fileType: "text" },
      ];

      for (const file of files) {
        actions.push({
          type: "fileGenerator",
          path: join(answers.projectPath, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/plugin/default",
            `${file.filePath}.tpl`,
          ),
          fileType: file.fileType,
          data: answers,
        });
      }

      actions.push({
        type: "pkgInstall",
        path: answers.projectPath,
        packages: devDependencies,
      });
      return actions;
    } as DynamicActionsFunction,
  });
}
