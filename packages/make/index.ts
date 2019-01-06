import * as fs from "fs";
import {
	builder ,
	getChangedTree ,
	getDependencyTree ,
	storeBase,
} from "./utils/baseHandler";
/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @returns void
 *
 */
export default function make(base: string, entry: string) {
	let isBase: Boolean = false;
	const currentTree: object = getDependencyTree(base, entry);
	// Check if `make` is not runned for the first time
	if (fs.existsSync(__dirname + "/base")) {
		isBase = true;
	}

	if (!isBase) {
		// if make is called for the first time
		storeBase(base, currentTree);
		builder(currentTree);
	} else {
		// else get changes and build only changed files
		const baseTree = getDependencyTree(__dirname + "/base", entry);
		const changedTree = getChangedTree(baseTree, currentTree, base);
		builder(changedTree);
	}
}
