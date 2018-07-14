import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Transform which consolidates the `resolve.root` configuration option into the `resolve.modules` array
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function transformer(j: IJSCodeshift, ast: INode): INode[] | void {

	const getRootVal = (p: INode): INode => {
		return p.node.value.properties.filter((prop: INode): boolean => prop.key.name === "root")[0];
	};

	const getRootIndex = (p: INode): number => {
		return p.node.value.properties.reduce((rootIndex: number, prop: INode, index: number): number => {
			return prop.key.name === "root" ? index : rootIndex;
		}, -1);
	};

	const isModulePresent = (p: INode): INode | false => {
		const modules: INode[] = p.node.value.properties.filter(
			(prop: INode): boolean => prop.key.name === "modules",
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

	const createModuleArray = (p: INode): INode => {

		const rootVal: INode = getRootVal(p);

		let modulesVal: INode[] = null;

		if (rootVal.value.type === "ArrayExpression") {
			modulesVal = rootVal.value.elements;
		} else {
			modulesVal = [rootVal.value];
		}

		let module: INode | false = isModulePresent(p);

		if (!module) {
			module = j.property(
				"init",
				j.identifier("modules"),
				j.arrayExpression(modulesVal),
			);
			p.node.value.properties = p.node.value.properties.concat([module]);
		} else {
			module.value.elements = module.value.elements.concat(modulesVal);
		}

		const rootIndex: number = getRootIndex(p);

		p.node.value.properties.splice(rootIndex, 1);

		return p;
	};

	return ast
		.find(j.Property)
		.filter((p: INode): boolean => {
			return (
				p.node.key.name === "resolve" &&
				p.node.value.properties.filter((prop: INode): boolean => prop.key.name === "root")
					.length === 1
			);
		})
		.forEach(createModuleArray);
}
