// Cspell:ignore plopfile, plopfile.js
import { NodePlopAPI, Answers, ActionType } from "../../types";
import { dirname, resolve, join } from "path";
import ejs from "ejs";
import { DynamicActionsFunction } from "node-plop";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default async function (plop: NodePlopAPI) {
  // dependencies to be installed
  const dependencies: Array<string> = [
    "webpack",
    "webpack-cli",
    "vue@3",
    "webpack-dev-server",
    "html-webpack-plugin",
    "vue-loader@next",
    "@vue/compiler-sfc",
  ];

  await plop.load("../../utils/pkgInstallAction.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));

  // Define a base generator for the Vue 3 project structure
  plop.setGenerator("init-vue", {
    description: "Create a basic Vue 3-Webpack project",
    prompts: [
      {
        type: "input",
        name: "projectPath",
        message: "Enter the project destination:",
        default: ".",
        filter: (input) => {
          return resolve(process.cwd(), input);
        },
      },
      {
        type: "list",
        name: "langType",
        message: "Which of the following JS solutions do you want to use?",
        choices: ["ES6", "Typescript"],
        default: "ES6",
      },
      {
        type: "confirm",
        name: "useVueRouter",
        message: "Do you want to use Vue Router?",
        default: false,
      },
      {
        type: "confirm",
        name: "useVueStore",
        message: "Do you want to use Pinia for state management?",
        default: false,
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
        default: "none",
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
        default: (answers: Answers) => answers.cssType == "CSS only",
      },
      {
        type: "list",
        name: "extractPlugin",
        message: "Do you want to extract CSS into separate files?",
        choices: ["No", "Only for Production", "Yes"],
        default: "No",
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
    actions: function (answers: Answers) {
      // setting some default values based on the answers
      const actions: ActionType[] = [];
      answers.htmlWebpackPlugin = true;
      answers.devServer = true;

      switch (answers.langType) {
        case "ES6":
          dependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          dependencies.push("typescript", "ts-loader", "@vue/eslint-config-typescript");
          break;
      }

      if (answers.useVueRouter) {
        dependencies.push("vue-router@4");
      }

      if (answers.useVueStore) {
        dependencies.push("pinia");
      }

      if (answers.isPostCSS) {
        dependencies.push("postcss-loader", "postcss", "autoprefixer");
      }

      if (answers.workboxWebpackPlugin) {
        dependencies.push("workbox-webpack-plugin");
      }

      if (answers.cssType === "none") {
        answers.isCSS = false;
        answers.isPostCSS = false;
        answers.extractPlugin = "No";
      } else {
        dependencies.push("vue-style-loader", "style-loader", "css-loader");
        switch (answers.cssType) {
          case "CSS only":
            answers.isCSS = true;
            break;
          case "SASS":
            dependencies.push("sass-loader", "sass");
            break;
          case "LESS":
            dependencies.push("less-loader", "less");
            break;
          case "Stylus":
            dependencies.push("stylus-loader", "stylus");
            break;
        }
      }

      if (answers.extractPlugin !== "No") {
        dependencies.push("mini-css-extract-plugin");
      }

      const files = [
        "./index.html",
        "./src/assets/webpack.png",
        "webpack.config.js",
        "package.json",
        "README.md",
      ];

      switch (answers.langType) {
        case "Typescript":
          answers.entry = "./src/main.ts";
          files.push(
            "tsconfig.json",
            "./src/App.vue",
            "./src/components/HelloWorld.vue",
            answers.entry as string,
          );
          break;
        case "ES6":
          answers.entry = "./src/main.js";
          files.push("./src/App.vue", "./src/components/HelloWorld.vue", answers.entry as string);
          break;
      }
      if (answers.useVueRouter) {
        if (answers.langType === "Typescript") {
          files.push("./src/router/index.ts");
        } else {
          files.push("./src/router/index.js");
        }
      }

      if (answers.useVueStore) {
        if (answers.langType === "Typescript") {
          files.push("./src/store/index.ts");
        } else {
          files.push("./src/store/index.js");
        }
      }

      switch (answers.cssType) {
        case "CSS only":
          files.push("./src/styles/global.css");
          break;
        case "SASS":
          files.push("./src/styles/global.scss");
          break;
        case "LESS":
          files.push("./src/styles/global.less");
          break;
        case "Stylus":
          files.push("./src/styles/global.styl");
          break;
      }

      for (const file of files) {
        actions.push({
          type: "add",
          path: join(answers.projectPath, file),
          templateFile: join(plop.getPlopfilePath(), "../templates/init/vue", `${file}.tpl`),
          transform: (content: string) => ejs.render(content, answers),
          force: true,
        });
      }

      actions.push({
        type: "pkgInstall",
        path: plop.renderString("{{projectPath}}/", answers),
        packages: dependencies,
      });

      return actions;
    } as DynamicActionsFunction,
  });
}
