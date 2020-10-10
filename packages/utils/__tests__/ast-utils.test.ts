'use strict';

import j from 'jscodeshift/dist/core';
import {
    addProperty,
    createIdentifierOrLiteral,
    createLiteral,
    createOrUpdatePluginByName,
    createProperty,
    findObjWithOneOfKeys,
    findPluginsArrayAndRemoveIfEmpty,
    findPluginsByName,
    findRootNodesByName,
    findVariableToPlugin,
    getRequire,
    safeTraverse,
    safeTraverseAndGetType,
} from '../src/ast-utils';
import { Node } from '../src/types/NodePath';

describe('utils', () => {
    describe('createProperty', () => {
        it('should create properties for Boolean', () => {
            const res = createProperty(j, 'foo', true);
            expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
        });

        it('should create properties for Number', () => {
            const res = createProperty(j, 'foo', -1);
            expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
        });

        it('should create properties for String', () => {
            const res = createProperty(j, 'foo', 'bar');
            expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
        });

        it('should create properties for complex keys', () => {
            const res = createProperty(j, 'foo-bar', 'bar');
            expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
        });

        it('should create properties for non-literal keys', () => {
            const res = createProperty(j, 1, 'bar');
            expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
        });
    });

    describe('findPluginsByName', () => {
        it('should find plugins in AST', () => {
            const ast = j(`
{ foo: new webpack.optimize.UglifyJsPlugin() }
`);
            const res = findPluginsByName(j, ast, ['webpack.optimize.UglifyJsPlugin']);
            expect(res.size()).toEqual(1);
        });

        it('should find all plugins in AST', () => {
            const ast = j(`
[
	new UglifyJsPlugin(),
	new TestPlugin()
]
`);
            const res = findPluginsByName(j, ast, ['UglifyJsPlugin', 'TestPlugin']);
            expect(res.size()).toEqual(2);
        });

        it('should not find false positives', () => {
            const ast = j(`
{ foo: new UglifyJsPlugin() }
`);
            const res = findPluginsByName(j, ast, ['webpack.optimize.UglifyJsPlugin']);
            expect(res.size()).toEqual(0);
        });
    });

    describe('findPluginsArrayAndRemoveIfEmpty', () => {
        it('should remove plugins property', () => {
            const ast = j(`
				const a = {
					plugins: []
				}
			`);
            findPluginsArrayAndRemoveIfEmpty(j, ast);
            expect(ast.toSource()).toMatchSnapshot();
        });

        it('It should not remove plugins array, given an array with length greater than zero', () => {
            const ast = j(`
				const a = {
					plugins: [
						new MyCustomPlugin()
					]
				}
			`);
            findPluginsArrayAndRemoveIfEmpty(j, ast);
            expect(ast.toSource()).toMatchSnapshot();
        });
    });

    describe('findRootNodesByName', () => {
        it('should find plugins: [] nodes', () => {
            const ast = j(`
const a = { plugins: [], foo: { plugins: [] } }
`);
            const res = findRootNodesByName(j, ast, 'plugins');
            expect(res.size()).toEqual(2);
        });

        it('should not find plugins: [] nodes', () => {
            const ast = j(`
const a = { plugs: [] }
`);
            const res = findRootNodesByName(j, ast, 'plugins');
            expect(res.size()).toEqual(0);
        });
    });

    describe('createOrUpdatePluginByName', () => {
        it('should create a new plugin without arguments', () => {
            const ast = j('{ plugins: [] }');
            ast.find(j.ArrayExpression).forEach((node: Node) => {
                createOrUpdatePluginByName(j, node, 'Plugin');
            });
            expect(ast.toSource()).toMatchSnapshot();
        });

        it('should create a new plugin with arguments', () => {
            const ast = j('{ plugins: [] }');
            ast.find(j.ArrayExpression).forEach((node: Node) => {
                createOrUpdatePluginByName(j, node, 'Plugin', {
                    foo: 'bar',
                });
            });
            expect(ast.toSource()).toMatchSnapshot();
        });

        it('should add an object as an argument', () => {
            const ast = j('[new Plugin()]');
            ast.find(j.ArrayExpression).forEach((node: Node) => {
                createOrUpdatePluginByName(j, node, 'Plugin', {
                    foo: true,
                });
            });
            expect(ast.toSource()).toMatchSnapshot();
        });

        it('should merge options objects', () => {
            const ast = j('[new Plugin({ foo: true })]');
            ast.find(j.ArrayExpression).forEach((node: Node) => {
                createOrUpdatePluginByName(j, node, 'Plugin', {
                    bar: 'baz',
                    foo: false,
                });
                createOrUpdatePluginByName(j, node, 'Plugin', {
                    'baz-long': true,
                });
            });
            expect(ast.toSource()).toMatchSnapshot();
        });
    });

    describe('findVariableToPlugin', () => {
        it('should find the variable name of a plugin', () => {
            const ast = j(`
			const packageName = require('package-name');
			const someOtherconst = somethingElse;
			const otherPackage = require('other-package');
			`);
            const found = findVariableToPlugin(j, ast, 'other-package');
            expect(found).toEqual('otherPackage');
        });
    });

    describe('createLiteral', () => {
        it('should create basic literal', () => {
            const literal = createLiteral(j, 'stringLiteral');
            expect(j(literal).toSource()).toMatchSnapshot();
        });
        it('should create boolean', () => {
            const literal = createLiteral(j, 'true');
            expect(j(literal).toSource()).toMatchSnapshot();
        });
    });

    describe('createIdentifierOrLiteral', () => {
        it('should create basic literal', () => {
            const literal = createIdentifierOrLiteral(j, "'stringLiteral'");
            expect(j(literal).toSource()).toMatchSnapshot();
        });
        it('should create boolean', () => {
            const literal = createIdentifierOrLiteral(j, 'true');
            expect(j(literal).toSource()).toMatchSnapshot();
        });
    });

    describe('findObjWithOneOfKeys', () => {
        it('should find keys', () => {
            const ast = j(`
			const ab = {
				a: 1,
				b: 2
			}
			`);
            expect(
                ast
                    .find(j.ObjectExpression)
                    .filter((p) => findObjWithOneOfKeys(p, ['a']))
                    .size(),
            ).toEqual(1);
        });
    });

    describe('getRequire', () => {
        it('should create a require statement', () => {
            const require = getRequire(j, 'filesys', 'fs');
            expect(j(require).toSource()).toMatchSnapshot();
        });
    });

    describe('safeTraverse', () => {
        it('should safe traverse', () => {
            const testObject = {
                type: 'NodeType',
            };
            const p = {
                foo: {
                    bar: testObject,
                },
            };
            const require = safeTraverse(p, ['foo', 'bar']);
            expect(require).toEqual(testObject);
        });

        it('should safe traverse thrice', () => {
            const type = {
                type: 'NodeType',
            };
            const p = {
                parent: {
                    value: {
                        value: type,
                    },
                },
            };
            const traversedValue = safeTraverse(p, ['parent', 'value', 'value']);
            expect(traversedValue).toEqual(type);
        });
    });

    describe('safeTraverseAndGetType', () => {
        it('should safe traverse and get type', () => {
            const NODE_TYPE = 'NodeType';
            const p = {
                value: {
                    value: {
                        type: NODE_TYPE,
                    },
                },
            };
            const typeValue = safeTraverseAndGetType(p);
            expect(typeValue).toEqual(NODE_TYPE);
        });

        it('should safe traverse and return false if not found', () => {
            const NODE_TYPE = 'NodeType';
            const p = {
                foo: {
                    bar: {
                        type: NODE_TYPE,
                    },
                },
            };
            const typeValue = safeTraverseAndGetType(p);
            expect(typeValue).toEqual(false);
        });
    });

    describe('addProperty', () => {
        it('add entry property using init', () => {
            const ast = j('module.exports = {}');
            const propertyValue = {
                man: '() => duper',
                nice: "':)'",
                objects: 'are',
                super: [
                    'yeah',
                    {
                        loader: "'eslint-loader'",
                    },
                ],
            };

            const root = ast.find(j.ObjectExpression);

            root.forEach((p) => {
                addProperty(j, p, 'entry', propertyValue);
            });

            expect(ast.toSource()).toMatchSnapshot();
        });

        it('add entry property using add', () => {
            const ast = j(`module.exports = {
				entry: {
					objects: are,
					super: [yeah, {
					  options: {
						formatter: 'someOption'
					  }
					}],
					man: () => duper
				}
			}`);
            const propertyValue = {
                man: '() => duper',
                nice: "':)'",
                objects: 'are',
                super: [
                    'yeah',
                    {
                        loader: "'eslint-loader'",
                    },
                ],
            };

            const root = ast.find(j.ObjectExpression);

            findRootNodesByName(j, root, 'entry').forEach((p: Node) => {
                j(p).replaceWith(addProperty(j, p, 'entry', propertyValue, 'add'));
            });

            expect(ast.toSource()).toMatchSnapshot();
        });
    });
});
