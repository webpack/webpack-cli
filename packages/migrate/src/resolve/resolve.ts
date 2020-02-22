import { JSCodeshift, Node } from "../types/NodePath";

/**
 *
 * Transform which consolidates the `resolve.root` configuration option into the `resolve.modules` array
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function transformer(j: JSCodeshift, ast: Node): Node {
	const getRootVal = (p: Node): Node => {
		return (p.node.value as Node).properties.filter((prop: Node): boolean => prop.key.name === "root")[0];
	};

	const getRootIndex = (p: Node): number => {
		return (p.node.value as Node).properties.reduce((rootIndex: number, prop: Node, index: number): number => {
			return prop.key.name === "root" ? index : rootIndex;
		}, -1);
	};

	const isModulePresent = (p: Node): Node | false => {
		const modules: Node[] = (p.node.value as Node).properties.filter(
			(prop: Node): boolean => prop.key.name === "modules"
		);

		return modules.length > 0 && modules[0];
	};

	/**
	 *
	 * Add a `modules` property to the `resolve` object or update the existing one
	 * based on what is already in `resolve.root`
	 *
	 * @param {Node} p - ast node that represents the `resolve` property
	 * @returns {Node} ast - ast node
	 */

	const createModuleArray = (p: Node): Node => {
		const rootVal: Node = getRootVal(p);

		let modulesVal: Node[] = null;

		if ((rootVal.value as Node).type === "ArrayExpression") {
			modulesVal = (rootVal.value as Node).elements;
		} else {
			modulesVal = [rootVal.value as Node];
		}

		let module: Node | false = isModulePresent(p);

		if (!module) {
			module = j.property("init", j.identifier("modules"), j.arrayExpression(modulesVal));
			(p.node.value as Node).properties = (p.node.value as Node).properties.concat([module]);
		} else {
			(module.value as Node).elements = (module.value as Node).elements.concat(modulesVal);
		}

		const rootIndex: number = getRootIndex(p);

		(p.node.value as Node).properties.splice(rootIndex, 1);

		return p;
	};

	return ast
		.find(j.Property)
		.filter((p: Node): boolean => {
			return (
				p.node.key.name === "resolve" &&
				(p.node.value as Node).properties.filter((prop: Node): boolean => prop.key.name === "root").length === 1
			);
		})
		.forEach(createModuleArray);
}
