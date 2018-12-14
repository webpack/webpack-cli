import * as fs from "fs";
import * as j from "jscodeshift";
import * as dir from "node-dir";
import * as shell from "shelljs";

/**
 * @returns storeBase() , getDependenencyTree(), getChangedTree(), builder()
 *
 */

const log = (text: any) => process.stdout.write(text);

export function storeBase(userDirectory: fs.PathLike) {
	/**
	 * 	Stores base state at ./base/ from userDirectory
	 * 	@returns void
	 */
	if (!fs.existsSync(__dirname + "/base")) {
		fs.mkdirSync(__dirname + "/base");
	}
	dir.files(userDirectory.toString(),
	(err, files) => {
		if (err) {
			log(`[make] Error: ${err}`);
		} else {
			files.forEach( (file) => {
				file = file.slice( userDirectory.toString().length);
				const baseDir: fs.PathLike = file.split("/").slice(0, -1).join("/");
				if (file.match(/.*(.js|.ts|.scss)$/g)) {
					if (!fs.existsSync(__dirname + "/base/" + baseDir) && baseDir !== "") {
						shell.mkdir("-p", __dirname + "/base/" + baseDir);
					}
					fs.appendFile(__dirname + "/base" + file, "", (e) => {
						if (e) { log(`[make](storeBase,append) ${err}\n`); }
					});
					fs.copyFile(userDirectory + file, __dirname + "/base" + file, (e) => {
						if (e) { log(`[make](storeBase, copy) ${err}`); }
					});
					log(`Stored: ${file}\n`);
				} else {
					log(`Not Stored: ${file}\n`);
				}
			});
		}
	});
	return;
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

			// TODO: for static imports in Babel
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

export function getDependencyTree() {
	/**
	 *  Retuns dependency tree from ./base tree
	 *  @returns Object
	 */
	return {};
}

export function getChangedTree(userDirectory: fs.PathLike) {
	/**
	 *  Retuns dependency tree of changed files when files
	 *  from userDirectory are compared from ./base tree
	 *  @returns Object
	 */
	return {};
}

export function builder(tree: Object) {
	/**
	 *  Build files according to files in tree
	 *  @returns void
	 */
	return;
}
