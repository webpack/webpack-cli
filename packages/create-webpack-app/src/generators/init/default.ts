import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DynamicActionsFunction, type NodePlopAPI } from "node-plop";
import { type ActionType, type Answers, type FileRecord } from "../../types.js";

const STYLE_EXTENSIONS: Record<string, string> = {
  SASS: "scss",
  LESS: "less",
  Stylus: "styl",
};

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
        type: "list",
        name: "tsCompiler",
        message: "How should TypeScript be compiled?",
        // The labels spell out the trade-off; a label must not end with `)`,
        // which is what the prompt tests watch for to send the next answer
        choices: [
          {
            name: "webpack itself: strips types, no type checking, needs Node.js >= 22.6",
            value: "built-in",
          },
          {
            name: "ts-loader: type checks while it builds, and handles .tsx, enums and decorators",
            value: "ts-loader",
          },
        ],
        default: "built-in",
        when: (answers: Answers) => answers.langType === "Typescript",
      },
      {
        type: "confirm",
        name: "devServer",
        message: "Would you like to use Webpack Dev server?",
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
        name: "cssTool",
        message: "Which CSS tool do you want to use?",
        choices: [
          "none",
          "PostCSS",
          "SASS",
          "SASS with PostCSS",
          "LESS",
          "LESS with PostCSS",
          "Stylus",
          "Stylus with PostCSS",
        ],
        default: "none",
      },
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

      // the config template reads this, so it has to be set whatever the language is
      answers.useTsLoader = false;

      switch (answers.langType) {
        case "ES6":
          devDependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          // Type stripping covers erasable syntax only, so ts-loader stays on
          // offer; either way `typescript` backs the editor and `check:types`
          answers.useTsLoader = answers.tsCompiler === "ts-loader";

          if (answers.useTsLoader) {
            // ts-loader 9 (its latest) throws on TypeScript 7, so pin what it supports
            devDependencies.push("typescript@5", "ts-loader");
          } else {
            devDependencies.push("typescript");
          }
          break;
      }

      if (answers.devServer) {
        devDependencies.push("webpack-dev-server");
      }

      if (answers.workboxWebpackPlugin) {
        devDependencies.push("workbox-webpack-plugin");
      }

      const cssTool = (answers.cssTool as string | undefined) ?? "none";
      // PostCSS runs on its own or over a preprocessor, so both are read off the answer
      const preprocessor = Object.keys(STYLE_EXTENSIONS).find((name) => cssTool.startsWith(name));

      answers.usePostCSS = cssTool.includes("PostCSS");
      answers.useSASS = preprocessor === "SASS";
      answers.useLESS = preprocessor === "LESS";
      answers.useStylus = preprocessor === "Stylus";
      // The starter stylesheet is written in the language that was picked
      answers.styleExtension = preprocessor ? STYLE_EXTENSIONS[preprocessor] : "css";

      if (answers.usePostCSS) {
        devDependencies.push("postcss-loader", "postcss", "autoprefixer");
      }

      if (answers.useSASS) {
        devDependencies.push("sass-loader", "sass");
      }

      if (answers.useLESS) {
        devDependencies.push("less-loader", "less");
      }

      if (answers.useStylus) {
        devDependencies.push("stylus-loader", "stylus");
      }

      const files: FileRecord[] = [
        { filePath: "./index.html", fileType: "text" },
        {
          filePath: answers.langType === "Typescript" ? "webpack.config.ts" : "webpack.config.js",
          fileType: "text",
        },
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

      if (answers.usePostCSS) {
        files.push({ filePath: "postcss.config.js", fileType: "text" });
      }

      files.push({
        filePath: `./src/styles.${answers.styleExtension}`,
        fileType: "text",
      });

      for (const file of files) {
        actions.push({
          type: "generate-files",
          path: join(answers.projectPath as string, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/init/default",
            file.filePath.startsWith("webpack.config")
              ? "webpack.config.tpl"
              : `${file.filePath}.tpl`,
          ),
          fileType: file.fileType,
          data: answers,
          force: answers.force,
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
