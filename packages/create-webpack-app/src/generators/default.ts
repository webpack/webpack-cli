// Cspell:ignore plopfile, plopfile.js
import { NodePlopAPI, Answers, ActionType } from "../types";
import { dirname, join, resolve } from "path";
import ejs from "ejs";
import { DynamicActionsFunction } from "node-plop";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function (plop: NodePlopAPI) {
  // dependencies to be installed
  const dependencies: Array<string> = ["webpack", "webpack-cli"];

  await plop.load("../utils/pkgInstallAction.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../plopfile.js"));
  // Define a custom action for installing packages

  // Define a base generator for the project structure
  plop.setGenerator("default", {
    description: "Create a basic Webpack project",
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
        choices: ["npm", "yarn"],
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

      switch (answers.langType) {
        case "ES6":
          dependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
          break;
        case "Typescript":
          dependencies.push("typescript", "ts-loader");
          break;
      }

      if (answers.devServer) {
        dependencies.push("webpack-dev-server");
      }

      if (answers.htmlWebpackPlugin) {
        dependencies.push("html-webpack-plugin", "html-loader");
      }

      if (answers.workboxWebpackPlugin) {
        dependencies.push("workbox-webpack-plugin");
      }

      if (answers.isPostCSS) {
        dependencies.push("postcss-loader", "postcss", "autoprefixer");
      }

      if (answers.extractPlugin !== "No") {
        dependencies.push("mini-css-extract-plugin");
      }

      if (answers.cssType !== "none") {
        dependencies.push("style-loader", "css-loader");
        switch (answers.cssType) {
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

      const files = ["./index.html", "webpack.config.js", "package.json", "README.md"];

      switch (answers.langType) {
        case "Typescript":
          answers.entryPoint = "./src/index.ts";
          files.push("tsconfig.json", answers.entryPoint as string);
          break;
        case "ES6":
          answers.entryPoint = "./src/index.js";
          files.push("babel.config.json", answers.entryPoint as string);
          break;
        default:
          answers.entryPoint = "./src/index.js";
          files.push(answers.entryPoint as string);
          break;
      }
      if (answers.isPostCSS) {
        files.push("postcss.config.js");
      }

      for (const file of files) {
        actions.push({
          type: "add",
          path: join(answers.projectPath, file),
          templateFile: join(plop.getPlopfilePath(), "../templates/init/default", `${file}.tpl`),
          transform: (content: string) => ejs.render(content, answers),
          force: true,
        });
      }
      actions.push({
        type: "pkgInstall",
        path: plop.renderString("{{projectPath}}/", answers),
        // Custom function don't automatically render hbs template as path hence manual rendering
        packages: dependencies,
      });
      return actions;

      // answers.entryPoint = answers.langType === "Typescript" ? "./src/index.ts" : "./src/index.js";
      //     answers.jsConfig =
      //       answers.langType === "Typescript"
      //         ? "tsconfig.json"
      //         : answers.langType === "ES6"
      //           ? "babel.config.json"
      //           : null;
      //     answers.cssConfig = answers.isPostCSS ? "postcss.config.js" : null;
      //     // adding some dependencies based on the answers
      //     if (answers.devServer) {
      //       dependencies.push("webpack-dev-server");
      //     }
      //     if (answers.htmlWebpackPlugin) {
      //       dependencies.push("html-webpack-plugin", "html-loader");
      //     }
      //     if (answers.workboxWebpackPlugin) {
      //       dependencies.push("workbox-webpack-plugin");
      //     }
      //     if (answers.isPostCSS) {
      //       dependencies.push("postcss-loader", "postcss", "autoprefixer");
      //     }
      //
      //     const actions: ActionType[] = [
      //       {
      //         type: "addMany",
      //         destination: "{{projectPath}}/",
      //         base: "../templates/init/default",
      //         templateFiles: "../templates/init/default/**/*",
      //         transform: (content: string, data: Answers) => {
      //           return ejs.render(content, data);
      //         },
      //         stripExtensions: ["tpl"],
      //         force: true,
      //         verbose: true,
      //       },
      //       {
      //         type: "add",
      //         path: "{{projectPath}}/{{entryPoint}}",
      //         force: true,
      //         transform: (data: Answers) => {
      //           if (data.langType === "Typescript") {
      //             return `console.log("Hello, this is the entrypoint for your TypeScript Project!");`;
      //           } else if (data.langType === "ES6") {
      //             return `console.log("Hello, this is the entrypoint for your ES6 Project!");`;
      //           } else {
      //             return `console.log("Hello, this is the entrypoint for your Project!");`;
      //           }
      //         },
      //       },
      //     ];
      //     if (answers.jsConfig) {
      //       actions.push({
      //         type: "add",
      //         templateFile: "../templates/init/customFiles/{{jsConfig}}",
      //         path: "{{projectPath}}/{{jsConfig}}",
      //         force: true,
      //       });
      //     }
      //     if (answers.cssConfig) {
      //       actions.push({
      //         type: "add",
      //         templateFile: "../templates/init/customFiles/{{cssConfig}}",
      //         path: "{{projectPath}}/{{cssConfig}}",
      //         force: true,
      //       });
      //     }
      //     actions.push({
      //       type: "pkgInstall",
      //       path: plop.renderString("{{projectPath}}/", answers),
      //       // Custom function don't automatically render hbs template as path hence manual rendering
      //       packages: dependencies,
      //     });
      //     return actions;
    } as DynamicActionsFunction,
  });
}
