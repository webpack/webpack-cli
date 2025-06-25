import { type LoaderAnswers, type ActionType, type FileRecord } from "../../types.js";
import { type NodePlopAPI, type DynamicActionsFunction } from "node-plop";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../../utils/logger.js";

export default async function loaderGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: string[] = ["webpack-defaults"];

  await plop.load("../../utils/install-dependencies.js", {}, true);
  await plop.load("../../utils/generate-files.js", {}, true);

  // custom helper function
  plop.setHelper("makeLoaderName", (name: string) => {
    name = plop.getHelper("kebabCase")(name);

    if (!name.endsWith("loader")) {
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
    actions: function actions(answers: LoaderAnswers) {
      const actions: ActionType[] = [];
      answers.projectPath = join(answers.projectPath, answers.name);

      logger.error(`
				Your project must be inside a folder named ${answers.name}
				I will create this folder for you.
                `);

      const files: FileRecord[] = [
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
          type: "generate-files",
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
        type: "install-dependencies",
        path: answers.projectPath,
        packages: devDependencies,
      });
      return actions;
    } as DynamicActionsFunction,
  });
}
