const path = require("path");

/**
 * Takes in a file path in the `./templates` directory. Copies that
 * file to the destination, with the `.tpl` extension stripped.
 *
 * @param {Generator} generator A Yeoman Generator instance
 * @param {string} templateDir Absolute path to template directory
 * @returns {Function} A curried function that takes a file path and copies it
 */
const generatorCopy = (
	generator,
	templateDir
) => /** @param {string} filePath */ filePath => {
	const sourceParts = templateDir.split(path.delimiter);
	sourceParts.push.apply(sourceParts, filePath.split("/"));
	const targetParts = path.dirname(filePath).split("/");
	targetParts.push(path.basename(filePath, ".tpl"));

	generator.fs.copy(
		path.join.apply(null, sourceParts),
		generator.destinationPath(path.join.apply(null, targetParts))
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
const generatorCopyTpl = (
	generator,
	templateDir,
	templateData
) => /** @param {string} filePath */ filePath => {
	const sourceParts = templateDir.split(path.delimiter);
	sourceParts.push.apply(sourceParts, filePath.split("/"));
	const targetParts = path.dirname(filePath).split("/");
	targetParts.push(path.basename(filePath, ".tpl").slice(1));

	generator.fs.copyTpl(
		path.join.apply(null, sourceParts),
		generator.destinationPath(path.join.apply(null, targetParts)),
		templateData
	);
};

module.exports = {
	generatorCopy,
	generatorCopyTpl
};
