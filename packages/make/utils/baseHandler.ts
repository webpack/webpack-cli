import * as fs from "fs";
/**
 * @returns storeBase() , getDependenencyTree(), getChangedTree(), builder()
 *
 */

export function storeBase(userDirectory: fs.PathLike) {
	/**
	 * 	Stores base state at ./base/ from userDirectory
	 * 	@returns void
	 */
	fs.readdir(userDirectory, (err, files) => {
		if (err) {
			process.stdout.write(`
			[${err.name}]
			${err.message}
			`);
			return;
		}

		files.forEach((file) => {
			if (file.match(/.*(.js|.ts|.scss)/g)) {
				process.stdout.write(`
				[${err.name}]
				${err.message}
				`);
			}
		});
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
