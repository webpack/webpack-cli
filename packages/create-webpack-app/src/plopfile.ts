import { NodePlopAPI, Answers, ActionType } from "./types";
import { resolve } from "path";
import ejs from "ejs";
import { spawn } from "cross-spawn";
import { DynamicActionsFunction } from "node-plop";
import { ChildProcess, SpawnOptionsWithStdioTuple, StdioNull, StdioPipe } from "child_process";

export default function (plop: NodePlopAPI) {
  // dependencies to be installed
  const dependencies: Array<string> = ["webpack", "webpack-cli"];

  // Define a custom action for installing packages
  plop.setActionType("pkgInstall", (answers, config) => {
    const options: SpawnOptionsWithStdioTuple<
      StdioNull,
      StdioNull | StdioPipe,
      StdioPipe | StdioNull
    > = {
      cwd: config.path,
      stdio: [
        "inherit", // Use parent's stdio configuration
        process.stdout.isTTY ? "inherit" : "pipe", // Pipe child process' stdout to parent's stdout
        process.stderr.isTTY ? "inherit" : "pipe", // Pipe child process' stderr to parent's stderr
      ],
    };

    // promise to complete subprocess of installing packages and return a message
    const returnPromise: Promise<string> = new Promise((resolve, reject) => {
      const returnMessage = `Project Dependencies installed successfully`;
      const packageManager = answers.packageManager;
      const installCommandPrefix = packageManager === "yarn" ? "add" : "install";
      const installMode = packageManager === "yarn" ? "-D" : "--save-dev";

      const npmInstallPackages: ChildProcess = spawn(
        `${packageManager}`,
        [`${installCommandPrefix}`, `${installMode}`, ...config.packages],
        options,
      );
      npmInstallPackages.stdout?.on("data", (data) => {
        console.log(data.toString());
      });
      npmInstallPackages.stderr?.on("data", (data) => {
        console.warn(data.toString());
      });
      npmInstallPackages.on("exit", (code) => {
        if (code === 0) {
          resolve(returnMessage);
        } else {
          reject(`Error occurred while installing packages\n Exit code: ${code}`);
        }
      });
    });
    return returnPromise;
  });

  // Define a base generator for the project structure
  plop.setGenerator("init", {
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
        type: "input",
        name: "projectName",
        message: "Enter your project name:",
        default: "webpack-project",
        validate(input) {
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "langType",
        message: "Which of the following JS solutions do you want to use?",
        choices: ["none", "ES6", "Typescript"],
        default: "none",
        filter: (input) => {
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
          `Will you be using CSS styles along with ${answers.cssType} in your project?`,
        when: (answers) => answers.cssType !== "CSS only",
        default: true,
      },
      {
        type: "confirm",
        name: "isPostCSS",
        message: "Do you want to use PostCSS in your project?",
        when: (answers) => answers.isCSS,
        default: true,
      },
      {
        type: "list",
        name: "extractPlugin",
        message: "Do you want to extract CSS into separate files?",
        choices: ["No", "Only for Production", "Yes"],
        when: (answers) => answers.isCSS,
        default: "No",
        filter: (input) => {
          if (input !== "No") {
            dependencies.push("mini-css-extract-plugin");
          }
          return input;
        },
      },
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager do you want to use?",
        choices: ["npm", "yarn"],
        default: "yarn",
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
      answers.entryPoint = answers.langType === "Typescript" ? "./src/index.ts" : "./src/index.js";
      answers.jsConfig = null;
      answers.jsConfig = answers.langType === "Typescript" ? "tsconfig.json" : "babel.config.json";
      answers.cssConfig = answers.isPostCSS ? "postcss.config.js" : null;

      // adding some dependencies based on the answers
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
        dependencies.push("postcss-loader", "autoprefixer");
      }

      const actions: ActionType[] = [
        {
          type: "addMany",
          destination: "{{projectPath}}/{{dashCase projectName}}",
          base: "../templates/init/default",
          templateFiles: "../templates/init/default/**/*",
          transform: (content: string, data: Answers) => {
            return ejs.render(content, data);
          },
          stripExtensions: ["tpl"],
          force: true,
          verbose: true,
        },
        {
          type: "add",
          path: "{{projectPath}}/{{dashCase projectName}}/{{entryPoint}}",
          force: true,
          transform: (data: Answers) => {
            if (data.langType === "Typescript") {
              return `console.log("Hello, this is the entrypoint for your TypeScript Project!");`;
            } else if (data.langType === "ES6") {
              return `console.log("Hello, this is the entrypoint for your ES6 Project!");`;
            } else {
              return `console.log("Hello, this is the entrypoint for your Project!");`;
            }
          },
        },
      ];
      if (answers.jsConfig) {
        actions.push({
          type: "add",
          templateFile: "../templates/init/customFiles/{{jsConfig}}",
          path: "{{projectPath}}/{{dashCase projectName}}/{{jsConfig}}",
          force: true,
        });
      }
      if (answers.cssConfig) {
        actions.push({
          type: "add",
          templateFile: "../templates/init/customFiles/{{cssConfig}}",
          path: "{{projectPath}}/{{dashCase projectName}}/{{cssConfig}}",
          force: true,
        });
      }
      actions.push({
        type: "pkgInstall",
      });
      return actions;
    } as DynamicActionsFunction,
  });
}
