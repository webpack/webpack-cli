import * as path from "path";

interface IGenerator {
	fs: {
		copy(from: string, to: string, options?: object): void;
		copyTpl(from: string, to: string, context: object, templateOptions?: object, copyOptions?: object): void;
	};
	destinationPath: (path: string) => string;
}

/**
 * Takes in a file path in the `./templates` directory. Copies that
 * file to the destination, with the `.tpl` extension stripped.
 *
 * @param {Generator} generator A Yeoman Generator instance
 * @param {string} templateDir Absolute path to template directory
 * @returns {Function} A curried function that takes a file path and copies it
 */
export const generatorCopy = (
	generator: any,
	templateDir: string,
): (filePath: string) => void => (filePath: string): void => {
	const sourceParts: string[] = templateDir.split(path.delimiter);
	sourceParts.push.apply(sourceParts, filePath.split("/"));
	const targetParts: string[] = path.dirname(filePath).split("/");
	targetParts.push(path.basename(filePath, ".tpl"));

	generator.fs.copy(
		path.join.apply(null, sourceParts),
		generator.destinationPath(path.join.apply(null, targetParts)),
	);
};

/**
 * Takes in a file path in the `./templates` directory. Copies that
 * file to the destination, with the `.tpl` extension and `_` prefix
 * stripped. Passes `this.props` to the template.
 *
 * @param {Generator} generator A Yeoman Generator instance
 * @param {string} templateDir Absolute path to template directory
 * @param {any} templateData An object containing the data passed to
 * the template files.
 * @returns {Function} A curried function that takes a file path and copies it
 */
export const generatorCopyTpl = (
	generator: any,
	templateDir: string,
	templateData: object,
): (filePath: string) => void => (filePath: string): void => {
	const sourceParts: string[] = templateDir.split(path.delimiter);
	sourceParts.push.apply(sourceParts, filePath.split("/"));
	const targetParts: string[] = path.dirname(filePath).split("/");
	targetParts.push(path.basename(filePath, ".tpl").slice(1));

	generator.fs.copyTpl(
		path.join.apply(null, sourceParts),
		generator.destinationPath(path.join.apply(null, targetParts)),
		templateData,
	);
};
