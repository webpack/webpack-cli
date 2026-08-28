import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DynamicActionsFunction, type NodePlopAPI } from "node-plop";
import { type ActionType, type Answers, type FileRecord } from "../../types.js";

const STYLE_EXTENSIONS: Record<string, string> = {
  SASS: "scss",
  LESS: "less",
  Stylus: "styl",
};

export default async function reactInitGenerator(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // dependencies to be installed
  const devDependencies: string[] = [
    "webpack",
    "webpack-cli",
    "react@18",
    "react-dom@18",
    "webpack-dev-server",
    "react-router-dom",
    "@types/react-router-dom",
  ];

  await plop.load("../../utils/install-dependencies.js", {}, true);
  await plop.load("../../utils/generate-files.js", {}, true);

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
          devDependencies.push(
            "babel-loader",
            "@babel/core",
            "@babel/preset-env",
            "@babel/preset-react",
          );
          break;
        case "Typescript":
          // ts-loader 9 (its latest) throws on TypeScript 7, the native port, so pin
          // the last release of the JavaScript line it still works with
          devDependencies.push("typescript@6", "ts-loader", "@types/react", "@types/react-dom");
          break;
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
        {
          filePath: answers.langType === "Typescript" ? "webpack.config.ts" : "webpack.config.js",
          fileType: "text",
        },
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
            "../templates/init/react",
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
