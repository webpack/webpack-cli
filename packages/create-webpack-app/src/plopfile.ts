import { NodePlopAPI } from "./types";
import { resolve } from "path";
/* eslint-disable no-unused-vars */

export default function (plop: NodePlopAPI) {
  const dependencies = ["webpack", "webpack-cli"];
  // Define a base generator for the project structure
  plop.setGenerator("init", {
    description: "Create a basic Webpack project",
    prompts: [
      {
        type: "input",
        name: "projectName",
        message: "Enter your project name:",
        default: "webpack-project",
        validate(input, _) {
          if (!input) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "configPath",
        message: "Enter the project destination:",
        default: ".",
        filter: (input, answers) => {
          return resolve(input, answers.projectName);
        },
      },
      {
        type: "list",
        name: "langType",
        message: "Which of the following JS solutions do you want to use?",
        choices: ["none", "ES6", "Typescript"],
        default: "none",
        filter: (input, _) => {
          switch (input) {
            case "ES6":
              dependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
              break;
            case "Typescript":
              dependencies.push("typescript", "ts-loader");
              break;
          }
          return input;
        },
      },
      {
        type: "confirm",
        name: "devServer",
        message: "Would you like to use Webpack Dev server?",
        default: true,
        filter: (input, _) => {
          if (input) {
            dependencies.push("webpack-dev-server");
          }
          return input;
        },
      },
      {
        type: "confirm",
        name: "htmlWebpackPlugin",
        message: "Do you want to simplify the creation of HTML files for your bundle?",
        default: true,
        filter: (input, _) => {
          if (input) {
            dependencies.push("html-webpack-plugin", "html-loader");
          }
          return input;
        },
      },
      {
        type: "confirm",
        name: "workboxWebpackPlugin",
        message: "Do you want to add PWA support?",
        default: true,
        filter: (input, _) => {
          if (input) {
            dependencies.push("workbox-webpack-plugin");
          }
          return input;
        },
      },
      {
        type: "list",
        name: "cssType",
        message: "Which of the following CSS solution do you want to use?",
        choices: ["none", "CSS only", "SASS", "LESS", "Stylus"],
        default: "Css only",
        filter: (input, answers) => {
          if (input === "none") {
            answers.isCSS = false;
            answers.isPostCSS = false;
            answers.extractPlugin = "No";
          } else {
            dependencies.push("style-loader", "css-loader");
            switch (input) {
              case "CSS only":
                answers.isCSS = true;
                break;
              case "SASS":
                dependencies.push("sass-loader", "node-sass");
                break;
              case "LESS":
                dependencies.push("less-loader", "less");
                break;
              case "Stylus":
                dependencies.push("stylus-loader", "stylus");
                break;
            }
          }
          return input;
        },
      },
      {
        type: "confirm",
        name: "isCSS",
        message: (answers) =>
          `Will you be using CSS styles along with ${answers.cssType}in your project?`,
        when: (answers) => answers.cssType !== "CSS only",
        default: true,
      },
      {
        type: "confirm",
        name: "isPostCSS",
        message: "Do you want to use PostCSS in your project?",
        when: (answers) => answers.isCSS,
        filter: (input, _) => {
          if (input) {
            dependencies.push("postcss-loader", "autoprefixer");
          }
          return input;
        },
        default: true,
      },
      {
        type: "list",
        name: "extractPlugin",
        message: "Do you want to extract CSS into separate files?",
        choices: ["No", "Only for Production", "Yes"],
        when: (answers) => answers.isCSS,
        default: "No",
        filter: (input, _) => {
          if (input !== "No") {
            dependencies.push("mini-css-extract-plugin");
          }
          return input;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{configPath}}",
        base: "../templates/init/default",
        templateFiles: "../templates/init/default/**/*",
        force: true,
        verbose: true,
      },
    ],
  });
  plop.setHelper(
    "isEqualToString",
    function (this: typeof Function, value: string, comparison: string, options: any) {
      return value === comparison ? options.fn(this) : options.inverse(this);
    },
  );
}
// module.exports = plop.generator("basicProject").run;
