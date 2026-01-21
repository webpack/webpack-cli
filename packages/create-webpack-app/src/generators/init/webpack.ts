import * as fs from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DynamicActionsFunction, type NodePlopAPI } from "node-plop";
import { type ActionType, type Answers, type FileRecord } from "../../types.js";

export default async function defaultInitGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const dependencies = ["schema-utils", "loader-utils"];

  // dependencies to be installed
  const devDependencies: string[] = [
    // Utilities
    "del",
    "del-cli",
    "cross-env",
    "memfs",
    "standard-version",
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "commitlint-azure-pipelines-cli",
    "husky",
    "npm-run-all",

    // Jest
    "jest",
    "jest-junit",
    "babel-jest",

    // Babel
    "@babel/cli",
    "@babel/core",
    "@babel/preset-env",

    // ESLint
    "eslint",
    "eslint-plugin-import",
    "eslint-config-prettier",
    "lint-staged",
    "prettier",

    // Webpack
    "webpack",

    // Webpack Contrib
    "@webpack-contrib/defaults",
    "@webpack-contrib/eslint-config-webpack",
  ];

  await plop.load("../../utils/install-dependencies.js", {}, true);
  await plop.load("../../utils/generate-files.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));
  // Define a custom action for installing packages

  // Define a base generator for the project structure
  plop.setGenerator("init-webpack", {
    description: "Create a basic webpack project",
    prompts: [
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager do you want to use?",
        choices: ["npm", "yarn", "pnpm"],
        default: "npm",
        validate(input: string) {
          if (!input.trim()) {
            return "Package manager cannot be empty";
          }
          return true;
        },
      },
    ],

    actions: function actions(answers: Answers) {
      const actions: ActionType[] = [];

      const folderPath = join(plop.getPlopfilePath(), "../templates/init/webpack-defaults");

      const Files: string[] = [];

      function getFilePaths(Directory: string) {
        for (const File of fs.readdirSync(Directory)) {
          const Absolute = join(Directory, File);
          if (fs.statSync(Absolute).isDirectory()) {
            getFilePaths(Absolute);
            continue;
          } else {
            Files.push(Absolute);
            continue;
          }
        }
      }

      getFilePaths(folderPath);

      const files: FileRecord[] = Files.map((file: string) => {
        const [_, filePath] = file.split(folderPath);
        return { filePath, fileType: "text" };
      });

      for (const file of files) {
        let filePathWithoutTplExtension = file.filePath;

        if (file.filePath.endsWith(".tpl")) {
          [filePathWithoutTplExtension] = file.filePath.split(".tpl");
        }
        actions.push({
          type: "generate-files",
          path: join(answers.projectPath, filePathWithoutTplExtension),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/init/webpack-defaults",
            `${file.filePath}`,
          ),
          fileType: file.fileType,
          data: answers,
        });
      }

      actions.push({
        type: "install-dependencies",
        path: answers.projectPath,
        packages: dependencies,
        dev: false,
      });
      actions.push({
        type: "install-dependencies",
        path: answers.projectPath,
        packages: devDependencies,
      });

      return actions;
    } as DynamicActionsFunction,
  });
}
