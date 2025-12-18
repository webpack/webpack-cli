import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DynamicActionsFunction, type NodePlopAPI } from "node-plop";
import { type ActionType, type Answers, type FileRecord } from "../../types.js";

export default async function vueInitGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: string[] = [
    "webpack",
    "webpack-cli",
    "vue@3",
    "webpack-dev-server",
    "html-webpack-plugin",
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
        name: "cssType",
        message: "Which of the following CSS solution do you want to use?",
        choices: ["none", "CSS only", "SASS", "LESS", "Stylus"],
        default: "CSS only",
        filter: (input: string, answers: Answers) => {
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
        message: (answers: Answers) =>
          `Will you be using CSS styles along with ${answers.cssType} in your project?`,
        when: (answers: Answers) => answers.cssType !== "CSS only",
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
      answers.htmlWebpackPlugin = true;
      answers.devServer = true;

      switch (answers.langType) {
        case "ES6":
          devDependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          devDependencies.push("typescript", "ts-loader");
          break;
      }

      if (answers.useVueStore) {
        devDependencies.push("pinia");
      }

      if (answers.isPostCSS) {
        devDependencies.push("postcss-loader", "postcss", "autoprefixer");
      }

      if (answers.workboxWebpackPlugin) {
        devDependencies.push("workbox-webpack-plugin");
      }

      if (answers.cssType === "none") {
        answers.isCSS = false;
        answers.isPostCSS = false;
        answers.extractPlugin = "No";
      } else {
        devDependencies.push("vue-style-loader", "style-loader", "css-loader");
        switch (answers.cssType) {
          case "CSS only":
            answers.isCSS = true;
            break;
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
        { filePath: "./src/assets/webpack.png", fileType: "binary" },
        { filePath: "webpack.config.js", fileType: "text" },
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

      switch (answers.cssType) {
        case "CSS only":
          files.push({ filePath: "./src/styles/global.css", fileType: "text" });
          break;
        case "SASS":
          files.push({ filePath: "./src/styles/global.scss", fileType: "text" });
          break;
        case "LESS":
          files.push({ filePath: "./src/styles/global.less", fileType: "text" });
          break;
        case "Stylus":
          files.push({ filePath: "./src/styles/global.styl", fileType: "text" });
          break;
      }

      for (const file of files) {
        actions.push({
          type: "generate-files",
          path: join(answers.projectPath, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/init/vue",
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
