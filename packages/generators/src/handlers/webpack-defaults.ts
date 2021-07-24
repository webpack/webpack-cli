import path from "path";
import { CustomGenerator } from "../types";

const templatePath = path.resolve(__dirname, "../../init-template/webpack-template");

const resolveFile = (file: string): string => {
    return path.resolve(templatePath, file);
};

export function questions(): null {
    // no questions
    return;
}

// These files will be directly copied to the destination dir
const files = [
    ".gitignore",
    ".husky",
    ".editorconfig",
    ".eslintrc.js",
    "jest.config.js",
    "LICENSE",
    "lint-staged.config.js",
];

/**
 * Runs the generator from webpack-defaults
 */
export function generate(self: CustomGenerator): void {
    try {
        self.fs.extendJSON(
            self.destinationPath("package.json"),
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require(resolveFile("package.json")),
        );

        // Copy all starter files
        files.forEach((fileName) => {
            self.fs.copyTpl(resolveFile(fileName), self.destinationPath(fileName));
        });
    } catch (e) {
        console.error(e);
    }
}
