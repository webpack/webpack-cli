import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DynamicActionsFunction, type NodePlopAPI } from "node-plop";
import { type ActionType, type Answers, type FileRecord } from "../../types.js";

const STYLE_EXTENSIONS: Record<string, string> = {
  SASS: "scss",
  LESS: "less",
  Stylus: "styl",
};

export default async function vueInitGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: string[] = [
    "webpack",
    "webpack-cli",
    "vue@3",
    "webpack-dev-server",
    "vue-loader@next",
    "@vue/compiler-sfc",
    "vue-router@4",
  ];

  await plop.load("../../utils/install-dependencies.js", {}, true);
  await plop.load("../../utils/generate-files.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));

  // Define a base generator for the Vue 3 project structure
  plop.setGenerator("init-vue", {
    description: "Create a basic Vue-webpack project",
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
        name: "useVueStore",
        message: "Do you want to use Pinia for state management?",
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
      // setting some default values based on the answers
      const actions: ActionType[] = [];
      answers.devServer = true;

      switch (answers.langType) {
        case "ES6":
          devDependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          // ts-loader 9 (its latest) throws on TypeScript 7, the native port, so pin
          // the last release of the JavaScript line it still works with
          devDependencies.push("typescript@6", "ts-loader");
          break;
      }

      if (answers.useVueStore) {
        devDependencies.push("pinia");
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
        { filePath: "./src/assets/webpack.png", fileType: "binary" },
        {
          filePath: answers.langType === "Typescript" ? "webpack.config.ts" : "webpack.config.js",
          fileType: "text",
        },
        { filePath: "package.json", fileType: "text" },
        { filePath: "README.md", fileType: "text" },
        { filePath: "./src/App.vue", fileType: "text" },
        { filePath: "./src/components/Home.vue", fileType: "text" },
        { filePath: "./src/components/About.vue", fileType: "text" },
        { filePath: "./src/components/Layout.vue", fileType: "text" },
        { filePath: "./src/components/Navbar.vue", fileType: "text" },
      ];

      switch (answers.langType) {
        case "Typescript":
          answers.entry = "./src/main.ts";
          files.push(
            { filePath: "tsconfig.json", fileType: "text" },
            { filePath: answers.entry as string, fileType: "text" },
          );
          break;
        case "ES6":
          answers.entry = "./src/main.js";
          files.push({ filePath: answers.entry as string, fileType: "text" });
          break;
      }

      if (answers.langType === "Typescript") {
        files.push({ filePath: "./src/router/index.ts", fileType: "text" });
      } else {
        files.push({ filePath: "./src/router/index.js", fileType: "text" });
      }

      if (answers.useVueStore) {
        if (answers.langType === "Typescript") {
          files.push({ filePath: "./src/store/index.ts", fileType: "text" });
        } else {
          files.push({ filePath: "./src/store/index.js", fileType: "text" });
        }
      }

      if (answers.usePostCSS) {
        files.push({ filePath: "postcss.config.js", fileType: "text" });
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
            "../templates/init/vue",
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
