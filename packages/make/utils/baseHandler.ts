import * as fs from "fs";
import * as dir from "node-dir";
/**
 * @returns storeBase() , getDependenencyTree(), getChangedTree(), builder()
 *
 */

const log = (text) => { process.stdout.write(text); };

export function storeBase(userDirectory: fs.PathLike) {
	/**
	 * 	Stores base state at ./base/ from userDirectory
	 * 	@returns void
	 */
	dir.files(userDirectory.toString(),
	(err, files) => {
		if (err) {
			log(`[make] Error: ${err}`);
		} else {
			files.forEach( (file) => {
				file = file.slice( userDirectory.toString().length);
				const baseDir: fs.PathLike = file.split("/").splice(-1, 1).join("/");
				if (file.match(/.*(.js|.ts|.scss)/g)) {
					if (!fs.existsSync(baseDir)) {
						fs.mkdirSync(__dirname + "/base" + baseDir);
					}
					fs.copyFileSync(userDirectory + file, __dirname + "/base" + file);
					log(`Stored: ${file}\n`);
				}
			});
		}
	});
	return;
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
