import { Answers, ActionType, FileRecord } from "../../types";
import { dirname, resolve, join } from "path";
import { NodePlopAPI, DynamicActionsFunction } from "node-plop";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function (plop: NodePlopAPI) {
  // dependencies to be installed
  const devDependencies: Array<string> = [
    "webpack",
    "webpack-cli",
    "react@18",
    "react-dom@18",
    "webpack-dev-server",
    "html-webpack-plugin",
    "react-router-dom",
    "@types/react-router-dom",
  ];

  await plop.load("../../utils/pkgInstallAction.js", {}, true);
  await plop.load("../../utils/fileGenerator.js", {}, true);

  plop.setDefaultInclude({ generators: true, actionTypes: true });
  plop.setPlopfilePath(resolve(__dirname, "../../plopfile.js"));
  // Define a custom action for installing packages

  // Define a base generator for the project structure
  plop.setGenerator("init-react", {
    description: "Create a basic React-webpack project",
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
        name: "useReactState",
        message: "Do you want to use React State in your project?",
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
          devDependencies.push(
            "babel-loader",
            "@babel/core",
            "@babel/preset-env",
            "@babel/preset-react",
          );
          break;
        case "Typescript":
          devDependencies.push("typescript", "ts-loader", "@types/react", "@types/react-dom");
          break;
      }
      if (answers.isPostCSS) {
        devDependencies.push("postcss-loader", "postcss", "autoprefixer");
      }
      if (answers.cssType === "none") {
        answers.isCSS = false;
        answers.isPostCSS = false;
        answers.extractPlugin = "No";
      } else {
        devDependencies.push("style-loader", "css-loader");
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
      if (answers.workboxWebpackPlugin) {
        devDependencies.push("workbox-webpack-plugin");
      }

      const files: Array<FileRecord> = [
        { filePath: "./index.html", fileType: "text" },
        { filePath: "webpack.config.js", fileType: "text" },
        { filePath: "package.json", fileType: "text" },
        { filePath: "README.md", fileType: "text" },
        { filePath: "./src/assets/webpack.png", fileType: "binary" },
      ];

      switch (answers.langType) {
        case "Typescript":
          answers.entry = "./src/index.tsx";
          files.push(
            { filePath: "tsconfig.json", fileType: "text" },
            { filePath: "index.d.ts", fileType: "text" },
            { filePath: "./src/App.tsx", fileType: "text" },
            { filePath: "./src/components/About.tsx", fileType: "text" },
            { filePath: "./src/components/Home.tsx", fileType: "text" },
            { filePath: "./src/components/Navbar.tsx", fileType: "text" },
            { filePath: "./src/router/index.tsx", fileType: "text" },
            { filePath: answers.entry as string, fileType: "text" },
          );
          break;
        case "ES6":
          answers.entry = "./src/index.jsx";
          files.push(
            { filePath: "./src/App.jsx", fileType: "text" },
            { filePath: "./src/components/About.jsx", fileType: "text" },
            { filePath: "./src/components/Home.jsx", fileType: "text" },
            { filePath: "./src/components/Navbar.jsx", fileType: "text" },
            { filePath: "./src/router/index.jsx", fileType: "text" },
            { filePath: answers.entry as string, fileType: "text" },
          );
          break;
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
          type: "fileGenerator",
          path: join(answers.projectPath, file.filePath),
          templateFile: join(
            plop.getPlopfilePath(),
            "../templates/init/react",
            `${file.filePath}.tpl`,
          ),
          fileType: file.fileType,
          data: answers,
        });
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
