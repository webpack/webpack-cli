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

	if (fs.existsSync(__dirname + "/base")) {
		isBase = true;
	}

	if (!isBase) {
		storeBase(base, currentTree);
		builder(currentTree);
	} else {
		const baseTree = getDependencyTree(__dirname + "/base", entry);
		const changedTree = getChangedTree(baseTree, currentTree, base);
		builder(changedTree);
	}
}
