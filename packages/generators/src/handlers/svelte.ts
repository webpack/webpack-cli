import path from "path";

import InitGenerator from "../init-generator";
import { getFiles } from "../utils/helpers";

const templatePath = path.join(__dirname, "../../init-template/svelte");

export function questions(): null {
    // No questions
    return;
}

/**
 * Runs the generator from webpack-defaults
 */
export function generate(self: InitGenerator): void {
    let files = [];
    try {
        // An array of file paths (relative to `./templates`) of files to be copied to the generated project
        files = getFiles(templatePath);
    } catch (error) {
        self.utils.logger.error(`Failed to generate starter template.\n ${error}`);
        process.exit(2);
    }

    // Copy all starter files
    files.forEach((fileName) => {
        // `absolute-path/to/_file.js.tpl` -> `destination-path/file.js`
        const destFilePath = path.relative(templatePath, fileName);
        self.fs.copyTpl(fileName, self.destinationPath(destFilePath));
    });
}
