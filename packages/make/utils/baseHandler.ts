import * as fs from "fs";
import * as j from "jscodeshift";
import { exec } from "shelljs";

/**
 * 	Stores base state at ../base/ from `base` using `tree`
 * 	@returns void
 */
export function storeBase(base: string, tree: object) {
	Object.keys(tree).forEach((file) => {
		const folder = file.split("/").splice(-1, 1).join("/");
		exec(`mkdir -p ../base/${folder}`);
		fs.copyFileSync(base + file, __dirname + "../base/" + file);
	});
}

// Interface for a typical file
interface IFile {
	source: string;
	extension: string;
}

function getImports(fileName: string): string[] {

	const file = importFile(fileName);
	const ast = j(file.source);

	const imports = [];
	switch (file.extension) {
		case "ts":

			// For static imports
			ast.find(j.ImportDeclaration).forEach((path) => {
				imports.push(path.value.source.value);
			});

			// For dynamic imports using import()
			ast.find(j.CallExpression).forEach((path) => {
				if (path.value.callee.name === "import") {
					imports.push(path.value.arguments[0].value);
				}
			});

			break;

		case "js":

			// for require() imports
			ast.find(j.CallExpression).forEach((path) => {
				if (path.value.callee.name === "require") {
				imports.push(path.value.arguments[0].value);
				}
			});

			// for static imports in Babel
			ast.find(j.ImportDeclaration).forEach((path) => {
				imports.push(path.value.source.value);
			});
			break;
	}

	return imports;
}

function importFile(fileName: string): IFile {
	const file = {
		extension: "",
		source: "",
	};
	file.source = fs.readFileSync(fileName).toString();
	file.extension = fileName.split(".").pop();
	return file;
}

function getDependencyTreeHelper(base: string, entry: string, dependencyTree: object, currentDepth: string): object {
	const imports = getImports(base + entry);
	if (imports.length > 0) {
		imports.forEach((imp) => {
			// Currently assuming each file is import with its extension
			// And ignoring node_modules
			if (fs.existsSync(base + imp)) {
				const fileLocation =  imp.split("/").splice(-1, 1).join("/");
				dependencyTree[entry].push(currentDepth + imp);
				base += fileLocation;
				currentDepth += fileLocation;
				dependencyTree = getDependencyTreeHelper(base, imp, dependencyTree, currentDepth);
			}
		});
	}
	return dependencyTree;
}

/**
 *  Retuns dependency tree from base tree
 *  @returns Object
 */
export function getDependencyTree(base: string, entry: string): object {
	return getDependencyTreeHelper(base, entry, {}, "");
}

export function getChangedTree(baseTree: object, currentTree: object, base: string): object {
	const filesToBuild = {};
	for (const file in currentTree) {
		if (currentTree[file] !== baseTree[file]) {
			filesToBuild[file] = currentTree[file];
		} else {
			const baseFile = fs.readFileSync(__dirname + "../base/" + file);
			const currentFile = fs.readFileSync(base + file);
			exec(`diff ${currentFile} ${baseFile}`, (code, stdout, stderr) => {
				if (stdout !== "") {
					filesToBuild[file] = currentFile;
				}
			});
		}
	}
	return filesToBuild;
}
/**
 *  Build files according to files in tree
 *  @returns void
 */
export function builder(tree: Object) {

	return;
}
