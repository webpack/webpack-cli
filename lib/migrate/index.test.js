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
		rules: [{
			test: /.js$/,
			use: [{
                loader: 'babel-loader'
            }],
			include: path.join(__dirname, 'src')
		}]
	},
	resolve: {
        modules: ['node_modules', path.resolve('/src')]
    },
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin()
	]
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
		transform(input, [transformations.uglifyJsPluginTransform]).then(output => {
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
