import path from "path";
import { CustomGenerator } from "../types";

const templatePath = path.resolve(__dirname, "../../init-template/react");
const resolveFile = (file: string): string => {
    return path.resolve(templatePath, file);
};

/**
 * Asks questions to the user used to modify generation
 * @param self Generator values
 * @param Question Contains questions
 */

export async function questions(
    self: CustomGenerator,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Question: Record<string, any>,
): Promise<void> {
    // Add react dependencies
    self.dependencies.push("react", "react-dom");

    // Add webpack-dev-server always
    self.dependencies.push("webpack-dev-server");

    // Add html-webpack-plugin always
    self.dependencies.push("html-webpack-plugin");

    // Handle JS language solutions
    const { langType } = await Question.List(
        self,
        "langType",
        "Which of the following JS solutions do you want to use?",
        ["ES6"],
        "ES6",
        self.force,
    );

    switch (langType) {
        case "ES6":
            self.dependencies.push(
                "babel-loader",
                "@babel/core",
                "@babel/preset-env",
                "@babel/preset-react",
            );
            break;
        case "Typescript":
            self.dependencies.push("typescript", "ts-loader");
            break;
    }
}

/**
 * Handles generation of project files
 * @param self Generator values
 */
export function generate(self: CustomGenerator): void {
    const files = [
        "./src/index.html",
        "./src/index.js",
        "./src/index.png",
        "webpack.config.js",
        "package.json",
    ];
    for (const file of files) {
        self.fs.copyTpl(resolveFile(file + ".tpl"), self.destinationPath(file), self.answers);
    }
}
