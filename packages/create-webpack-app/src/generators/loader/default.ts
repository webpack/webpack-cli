import { Answers, ActionType, FileRecord } from "../../types";
import { dirname, join, resolve } from "path";
import { NodePlopAPI, DynamicActionsFunction } from "node-plop";
import { fileURLToPath } from "url";
import { logger } from "../../utils/logger";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function (plop: NodePlopAPI) {
  // dependencies to be installed
  const devDependencies: Array<string> = ["webpack-defaults"];

  await plop.load("../../utils/pkgInstallAction.js", {}, true);
  await plop.load("../../utils/fileGenerator.js", {}, true);

  // custom helper function
  plop.setHelper("makeLoaderName", (name: string) => {
    name = plop.getHelper("kebabCase")(name);

    if (!/loader$/.test(name)) {
      name += "-loader";
    }
    return name;
  });

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));

  // Define a base generator for the project structure
  plop.setGenerator("loader-default", {
    description: "Create a basic webpack loader.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Loader name?",
        default: "my-loader",
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
        { filePath: "./test/unit.test.js", fileType: "text" },
        { filePath: "./src/index.js", fileType: "text" },
      ];

      for (const file of files) {
        actions.push({
          type: "fileGenerator",
          path: join(answers.projectPath, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/loader/default",
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
