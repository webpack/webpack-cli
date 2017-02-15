const j = require('jscodeshift/dist/core');
const utils = require('./utils');

describe('utils', () => {
	describe('createProperty', () => {
		it('should create properties for Boolean', () => {
			const res = utils.createProperty(j, 'foo', true);
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it('should create properties for Number', () => {
			const res = utils.createProperty(j, 'foo', -1);
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it('should create properties for String', () => {
			const res = utils.createProperty(j, 'foo', 'bar');
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it('should create properties for complex keys', () => {
			const res = utils.createProperty(j, 'foo-bar', 'bar');
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});

		it('should create properties for non-literal keys', () => {
			const res = utils.createProperty(j, 1, 'bar');
			expect(j(j.objectExpression([res])).toSource()).toMatchSnapshot();
		});
	});

	describe('findPluginsByName', () => {
		it('should find plugins in AST', () => {
			const ast = j(`
{ foo: new webpack.optimize.UglifyJsPlugin() }
`);
			const res = utils.findPluginsByName(j, ast,
				['webpack.optimize.UglifyJsPlugin']);
			expect(res.size()).toEqual(1);
		});

		it('should find all plugins in AST', () => {
			const ast = j(`
[
	new UglifyJsPlugin(), 
	new TestPlugin()
]
`);
			const res = utils.findPluginsByName(j, ast,
				['UglifyJsPlugin', 'TestPlugin']);
			expect(res.size()).toEqual(2);
		});

		it('should not find false positives', () => {
			const ast = j(`
{ foo: new UglifyJsPlugin() }
`);
			const res = utils.findPluginsByName(j, ast,
				['webpack.optimize.UglifyJsPlugin']);
			expect(res.size()).toEqual(0);
		});
	});

	describe('findPluginsRootNodes', () => {
		it('should find plugins: [] nodes', () => {
			const ast = j(`
var a = { plugins: [], foo: { plugins: [] } }
`);
			const res = utils.findPluginsRootNodes(j, ast);
			expect(res.size()).toEqual(2);
		});

		it('should not find plugins: [] nodes', () => {
			const ast = j(`
var a = { plugs: [] }
`);
			const res = utils.findPluginsRootNodes(j, ast);
			expect(res.size()).toEqual(0);
		});
	});

	describe('createOrUpdatePluginByName', () => {
		it('should create a new plugin without arguments', () => {
			const ast = j('{ plugins: [] }');
			ast
				.find(j.ArrayExpression)
				.forEach(node => {
					utils.createOrUpdatePluginByName(j, node, 'Plugin');
				});
			expect(ast.toSource()).toMatchSnapshot();
		});

		it('should create a new plugin with arguments', () => {
			const ast = j('{ plugins: [] }');
			ast
				.find(j.ArrayExpression)
				.forEach(node => {
					utils.createOrUpdatePluginByName(j, node, 'Plugin', { foo: 'bar' });
				});
			expect(ast.toSource()).toMatchSnapshot();
		});

		it('should add an object as an argument', () => {
			const ast = j('[new Plugin()]');
			ast
				.find(j.ArrayExpression)
				.forEach(node => {
					utils.createOrUpdatePluginByName(j, node, 'Plugin', { foo: true });
				});
			expect(ast.toSource()).toMatchSnapshot();
		});

		it('should merge options objects', () => {
			const ast = j('[new Plugin({ foo: true })]');
			ast
				.find(j.ArrayExpression)
				.forEach(node => {
					utils.createOrUpdatePluginByName(j, node, 'Plugin', { bar: 'baz', foo: false });
					utils.createOrUpdatePluginByName(j, node, 'Plugin', { 'baz-long': true });
				});
			expect(ast.toSource()).toMatchSnapshot();
		});
	});
});
