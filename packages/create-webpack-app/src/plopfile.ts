import { NodePlopAPI } from "./types";
import { resolve, join } from "path";
import ejs from "ejs";
import { spawn } from "child_process";
export default function (plop: NodePlopAPI) {
  const dependencies = ["webpack", "webpack-cli"];
  plop.setActionType("pkgInstall", (answers) => {
    const options = {
      cwd: `${answers.projectPath}/${answers.projectName}`,
      encoding: "utf-8",
    };
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
    console.log(`Installing packages: ${dependencies.join(", ")}`);
    const returnMessage = `Project ${answers.projectName} has been successfully created at ${answers.projectPath}/${answers.projectName}`;
    const packageManager = answers.packageManager;
    const installCommandPrefix = packageManager === "yarn" ? "add" : "install";

    const npmInstallPackages = spawn(
      `${packageManager}`,
      [`${installCommandPrefix}`, ...dependencies],
      options,
    );
    npmInstallPackages.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    npmInstallPackages.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    npmInstallPackages.on("error", (err) => {
      console.error(err);
    });
    npmInstallPackages.on("close", (code) => {
      if (code !== 0) {
        console.error(`child process exited with code ${code}`);
        return;
      } else {
        console.log(returnMessage);
      }
    });
    return "Package Installation Phase..."; // executes before the child process is completed
  });
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
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "projectPath",
        message: "Enter the project destination:",
        default: ".",
        filter: (input) => {
          return resolve(join(process.cwd(), input));
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
          `Will you be using CSS styles along with ${answers.cssType}in your project?`,
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
        filter: (input, _) => {
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
        default: "npm",
        validate(input, _) {
          if (!input.trim()) {
            return "Package manager cannot be empty";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{projectPath}}/{{dashCase projectName}}",
        base: "../templates/init/default",
        templateFiles: "../templates/init/default/**/*",
        transform: (content, data) => {
          data.entryPoint = data.langType === "Typescript" ? "index.ts" : "index.js";
          return ejs.render(content, data);
        },
        stripExtensions: ["tpl"],
        force: true,
        verbose: true,
      },
      {
        type: "pkgInstall",
      },
    ],
  });
}
