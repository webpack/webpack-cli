// @flow
// eslint-disable-next-line node/no-unsupported-features
import type {
	Ijscodeshit,
	IPath,
	IProperty,
	IObjectExpression,
	IArrayExpression
} from "../../types";

module.exports = function transformer(j: Ijscodeshit, ast: IPath<*>) {

	const getRootVal = (p: IPath<IProperty<IObjectExpression>>): IProperty<IArrayExpression> => {
		return p.node.value.properties.filter(prop => prop.key.name === "root")[0];
	};

	const getRootIndex = p => {
		return p.node.value.properties
			.reduce((rootIndex, prop, index) => {
				return prop.key.name === "root" ? index : rootIndex;
			}, -1);
	};

	const isModulePresent = (p: IPath<IProperty<IObjectExpression>>) => {
		const modules = p.node.value.properties.filter(prop => prop.key.name === "modules");
		return modules.length > 0 && modules[0];
	};

	const createModuleArray = (p: IPath<IProperty<IObjectExpression>>): IPath<IProperty<IObjectExpression>> => {
		const rootVal = getRootVal(p);
		let modulesVal = null;
		if (rootVal.value.type === "ArrayExpression") {
			modulesVal = rootVal.value.elements;
		} else {
			modulesVal = [rootVal.value];
		}
		let module = isModulePresent(p);

		if (!module) {
			module = j.property("init", j.identifier("modules"), j.arrayExpression(modulesVal));
			p.node.value.properties = p.node.value.properties.concat([module]);
		} else {
			module.value.elements = module.value.elements.concat(modulesVal);
		}
		const rootIndex = getRootIndex(p);
		p.node.value.properties.splice(rootIndex, 1);
		return p;
	};

	return ast
		.find(j.Property)
		.filter((p: IPath<IProperty<IObjectExpression>>) => {
			return p.node.key.name === "resolve"
				&& p.node.value.properties
					.filter(prop => prop.key.name === "root")
					.length === 1;
		})
		.forEach(createModuleArray);
};
