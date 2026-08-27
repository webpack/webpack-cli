import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DynamicActionsFunction, type NodePlopAPI } from "node-plop";
import { type ActionType, type Answers, type FileRecord } from "../../types.js";

export default async function svelteInitGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: string[] = [
    "webpack",
    "webpack-cli",
    "svelte",
    "svelte-loader",
    "webpack-dev-server",
  ];

  await plop.load("../../utils/install-dependencies.js", {}, true);
  await plop.load("../../utils/generate-files.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));

  // Define a base generator for the Svelte project structure
  plop.setGenerator("init-svelte", {
    description: "Create a basic Svelte-webpack project",
    prompts: [
      {
        type: "list",
        name: "langType",
        message: "Which of the following JS solutions do you want to use?",
        choices: ["ES6", "Typescript"],
        default: "ES6",
      },
      {
        type: "confirm",
        name: "workboxWebpackPlugin",
        message: "Do you want to add PWA support?",
        default: true,
      },
      {
        type: "list",
        name: "cssPreprocessor",
        message: "Which CSS preprocessor do you want to use?",
        choices: ["none", "SASS", "LESS", "Stylus"],
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
      // setting some default values based on the answers
      const actions: ActionType[] = [];
      answers.devServer = true;

      switch (answers.langType) {
        case "ES6":
          devDependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          devDependencies.push("typescript", "ts-loader", "@tsconfig/svelte");
          break;
      }

      if (answers.workboxWebpackPlugin) {
        devDependencies.push("workbox-webpack-plugin");
      }

      switch (answers.cssPreprocessor) {
        case "SASS":
          answers.styleExtension = "scss";
          devDependencies.push("sass-loader", "sass");
          break;
        case "LESS":
          answers.styleExtension = "less";
          devDependencies.push("less-loader", "less");
          break;
        case "Stylus":
          answers.styleExtension = "styl";
          devDependencies.push("stylus-loader", "stylus");
          break;
        default:
          answers.styleExtension = "css";
          break;
      }

      const files: FileRecord[] = [
        { filePath: "./index.html", fileType: "text" },
        { filePath: "./src/assets/webpack.png", fileType: "binary" },
        {
          filePath: answers.langType === "Typescript" ? "webpack.config.ts" : "webpack.config.js",
          fileType: "text",
        },
        { filePath: "package.json", fileType: "text" },
        { filePath: "README.md", fileType: "text" },
        { filePath: "./src/components/HelloWorld.svelte", fileType: "text" },
        { filePath: "./src/App.svelte", fileType: "text" },
      ];

      switch (answers.langType) {
        case "Typescript":
          answers.entry = "./src/main.ts";
          files.push(
            { filePath: "tsconfig.json", fileType: "text" },
            { filePath: "./src/index.d.ts", fileType: "text" },
            { filePath: answers.entry as string, fileType: "text" },
          );
          break;
        case "ES6":
          answers.entry = "./src/main.js";
          files.push({ filePath: answers.entry as string, fileType: "text" });
          break;
      }

      if (answers.langType === "Typescript") {
        files.push({ filePath: "./src/store/index.ts", fileType: "text" });
      } else {
        files.push({ filePath: "./src/store/index.js", fileType: "text" });
      }

      files.push({
        filePath: `./src/styles/global.${answers.styleExtension}`,
        fileType: "text",
      });

      for (const file of files) {
        actions.push({
          type: "generate-files",
          path: join(answers.projectPath as string, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/init/svelte",
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
