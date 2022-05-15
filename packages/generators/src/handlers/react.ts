import path from "path";
import { CustomGenerator } from "../types";
import { questions as defaultQuestions } from "./default";
import * as QuestionAPI from "../utils/scaffold-utils";

const templatePath = path.resolve(__dirname, "../../init-template/react");
const resolveFile = (file: string): string => {
  return path.resolve(templatePath, file);
};

/**
 * Asks questions including default ones to the user used to modify generation
 * @param self Generator values
 * @param Question Contains questions
 */

export async function questions(
  self: CustomGenerator,
  Question: typeof QuestionAPI,
): Promise<void> {
  await defaultQuestions(self, Question, {
    langType: { required: true },
    devServer: { skip: true },
    htmlWebpackPlugin: { skip: true },
    workboxWebpackPlugin: {},
    cssType: {},
    isCSS: {},
    isPostCSS: {},
    extractPlugin: {},
  });

  // Add react dependencies
  self.dependencies.push("react@18", "react-dom@18");

  // Add webpack-dev-server always
  self.dependencies.push("webpack-dev-server");

  // Add html-webpack-plugin always
  self.dependencies.push("html-webpack-plugin");

  switch (self.answers.langType) {
    case "Typescript":
      self.dependencies.push("@types/react", "@types/react-dom");
      break;
    case "ES6":
      self.dependencies.push("@babel/preset-react");
      break;
  }
}

/**
 * Handles generation of project files
 * @param self Generator values
 */
export function generate(self: CustomGenerator): void {
  const files = ["./index.html", "./src/assets/webpack.png", "webpack.config.js", "package.json"];

  switch (self.answers.langType) {
    case "Typescript":
      self.answers.entry = "./src/index.tsx";
      files.push("tsconfig.json", "index.d.ts", "./src/App.tsx", self.answers.entry as string);
      break;
    case "ES6":
      self.answers.entry = "./src/index.js";
      files.push("./src/App.js", self.answers.entry as string);
      break;
  }

  switch (self.answers.cssType) {
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
    self.fs.copyTpl(resolveFile(file + ".tpl"), self.destinationPath(file as string), self.answers);
  }
}
