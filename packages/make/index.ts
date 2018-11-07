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
export default function make() {
	const userDirectory: String = process.cwd();

	let isBase: Boolean = false;
	let dependencyTree: Object;

	if (fs.existsSync(__dirname + "/base")) {
		isBase = true;
	} else {
		storeBase(userDirectory);
	}

	dependencyTree = getDependencyTree();

	if (!isBase) {
		builder(dependencyTree);
	} else {
		const changedTree: Object = getChangedTree(userDirectory);
		builder(changedTree);
	}
}
