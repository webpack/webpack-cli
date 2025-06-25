import { type Answers, type ActionType, type FileRecord } from "../../types.js";
import { type NodePlopAPI, type DynamicActionsFunction } from "node-plop";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export default async function defaultInitGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: string[] = ["webpack", "webpack-cli"];

  await plop.load("../../utils/install-dependencies.js", {}, true);
  await plop.load("../../utils/generate-files.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));
  // Define a custom action for installing packages

  // Define a base generator for the project structure
  plop.setGenerator("init-default", {
    description: "Create a basic webpack project",
    prompts: [
      {
        type: "list",
        name: "langType",
        message: "Which of the following JS solutions do you want to use?",
        choices: ["none", "ES6", "Typescript"],
        default: "none",
      },
      {
        type: "confirm",
        name: "devServer",
        message: "Would you like to use Webpack Dev server?",
        default: true,
      },
      {
        type: "confirm",
        name: "htmlWebpackPlugin",
        message: "Do you want to simplify the creation of HTML files for your bundle?",
        default: true,
      },
      {
        type: "confirm",
        name: "workboxWebpackPlugin",
        message: "Do you want to add PWA support?",
        default: true,
      },
      {
        type: "list",
        name: "cssType",
        message: "Which of the following CSS solution do you want to use?",
        choices: ["none", "CSS only", "SASS", "LESS", "Stylus"],
        default: "CSS only",
        filter: (input, answers) => {
          if (input === "none") {
            answers.isCSS = false;
            answers.isPostCSS = false;
            answers.extractPlugin = "No";
          } else if (input === "CSS only") {
            answers.isCSS = true;
          }
          return input;
        },
      },
      {
        type: "confirm",
        name: "isCSS",
        message: (answers) =>
          `Will you be using CSS styles along with ${answers.cssType} in your project?`,
        when: (answers) => answers.cssType !== "CSS only",
        default: true,
      },
      {
        type: "confirm",
        name: "isPostCSS",
        message: "Do you want to use PostCSS in your project?",
        default: (answers: Answers) => answers.cssType === "CSS only",
      },
      {
        type: "list",
        name: "extractPlugin",
        message: "Do you want to extract CSS into separate files?",
        choices: ["No", "Only for Production", "Yes"],
        default: "Only for Production",
      },
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager do you want to use?",
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
    actions: function actions(answers: Answers) {
      const actions: ActionType[] = [];

      switch (answers.langType) {
        case "ES6":
          devDependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          devDependencies.push("typescript", "ts-loader");
          break;
      }

      if (answers.devServer) {
        devDependencies.push("webpack-dev-server");
      }

      if (answers.htmlWebpackPlugin) {
        devDependencies.push("html-webpack-plugin", "html-loader");
      }

      if (answers.workboxWebpackPlugin) {
        devDependencies.push("workbox-webpack-plugin");
      }

      if (answers.isPostCSS) {
        devDependencies.push("postcss-loader", "postcss", "autoprefixer");
      }

      if (answers.extractPlugin !== "No") {
        devDependencies.push("mini-css-extract-plugin");
      }

      if (answers.cssType !== "none") {
        devDependencies.push("style-loader", "css-loader");
        switch (answers.cssType) {
          case "SASS":
            devDependencies.push("sass-loader", "sass");
            break;
          case "LESS":
            devDependencies.push("less-loader", "less");
            break;
          case "Stylus":
            devDependencies.push("stylus-loader", "stylus");
            break;
        }
      }
      if (answers.extractPlugin !== "No") {
        devDependencies.push("mini-css-extract-plugin");
      }

      const files: FileRecord[] = [
        { filePath: "./index.html", fileType: "text" },
        { filePath: "webpack.config.js", fileType: "text" },
        { filePath: "package.json", fileType: "text" },
        { filePath: "README.md", fileType: "text" },
      ];

      switch (answers.langType) {
        case "Typescript":
          answers.entryPoint = "./src/index.ts";
          files.push(
            { filePath: "tsconfig.json", fileType: "text" },
            { filePath: answers.entryPoint as string, fileType: "text" },
          );
          break;
        case "ES6":
          answers.entryPoint = "./src/index.js";
          files.push(
            { filePath: "babel.config.json", fileType: "text" },
            { filePath: answers.entryPoint as string, fileType: "text" },
          );
          break;
        default:
          answers.entryPoint = "./src/index.js";
          files.push({ filePath: answers.entryPoint as string, fileType: "text" });
          break;
      }

      if (answers.isPostCSS) {
        files.push({ filePath: "postcss.config.js", fileType: "text" });
      }

      for (const file of files) {
        actions.push({
          type: "generate-files",
          path: join(answers.projectPath, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/init/default",
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
