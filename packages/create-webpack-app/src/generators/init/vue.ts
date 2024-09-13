import { Answers, ActionType } from "../../types";
import { dirname, join, resolve } from "path";
import { NodePlopAPI, DynamicActionsFunction } from "node-plop";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default async function (plop: NodePlopAPI) {
  // dependencies to be installed
  const devDependencies: Array<string> = [
    "webpack",
    "webpack-cli",
    "vue@3",
    "webpack-dev-server",
    "html-webpack-plugin",
    "vue-loader@next",
    "@vue/compiler-sfc",
    "vue-router@4",
  ];

  await plop.load("../../utils/pkgInstallAction.js", {}, true);
  await plop.load("../../utils/fileActions.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));

  // Define a base generator for the Vue 3 project structure
  plop.setGenerator("init-vue", {
    description: "Create a basic Vue-webpack project",
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

      const files = [
        "./index.html",
        "./src/assets/webpack.png",
        "webpack.config.js",
        "package.json",
        "README.md",
        "./src/App.vue",
        "./src/components/Home.vue",
        "./src/components/About.vue",
        "./src/components/Layout.vue",
        "./src/components/Navbar.vue",
      ];

      switch (answers.langType) {
        case "Typescript":
          answers.entry = "./src/main.ts";
          files.push("tsconfig.json", answers.entry as string);
          break;
        case "ES6":
          answers.entry = "./src/main.js";
          files.push(answers.entry as string);
          break;
      }

      if (answers.langType === "Typescript") {
        files.push("./src/router/index.ts");
      } else {
        files.push("./src/router/index.js");
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
        const initialConfig: ActionType = {
          type: "fileActions",
          path: join(answers.projectPath, file),
          templateFile: join(plop.getPlopfilePath(), "../templates/init/vue", `${file}.tpl`),
          data: answers,
        };
        actions.push(initialConfig);
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
