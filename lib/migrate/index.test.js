"use strict";

const transform = require("./index").transform;
const transformations = require("./index").transformations;

const input = `
module.exports = {
	devtool: 'eval',
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js'
	},
	module: {
		loaders: [{
			test: /.js$/,
			loaders: ['babel'],
			include: path.join(__dirname, 'src')
		}]
	},
	resolve: {
		root: path.resolve('/src'),
		modules: ['node_modules']
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin()
	],
	debug: true
};
`;

describe("transform", () => {
	it("should not transform if no transformations defined", done => {
		transform(input, []).then(output => {
			expect(output).toMatchSnapshot(input);
			done();
		});
	});

	it("should transform using all transformations", done => {
		transform(input).then(output => {
			expect(output).toMatchSnapshot();
			done();
		});
	});

	it("should transform only using specified transformations", done => {
		transform(input, [transformations.loadersTransform]).then(output => {
			expect(output).toMatchSnapshot();
			done();
		});
	});

	it("should respect recast options", done => {
		transform(input, undefined, {
			quote: "double",
			trailingComma: true
		}).then(output => {
			expect(output).toMatchSnapshot();
			done();
		});
	});
});
