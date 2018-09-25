import { transform, transformations } from "../migrate";

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
	it("should not transform if no transformations defined", async () => {
		transform(input, []).then((output) => {
			expect(output).toMatchSnapshot(input);
		});
	});

	it("should transform using all transformations", async () => {
		transform(input).then((output) => {
			expect(output).toMatchSnapshot();
		});
	});

	it("should transform only using specified transformations", async () => {
		transform(input, [transformations.loadersTransform]).then((output) => {
			expect(output).toMatchSnapshot();
		});
	});

	it("should respect recast options", async () => {
		transform(input, undefined, {
			quote: "double",
			trailingComma: true,
		}).then((output) => {
			expect(output).toMatchSnapshot();
		});
	});
});
