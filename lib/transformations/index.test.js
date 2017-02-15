const transform = require('./index').transform;
const transformations = require('./index').transformations;

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
			test: /\.js$/,
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

describe('transform', () => {
	it('should not transform if no transformations defined', () => {
		const output = transform(input, []);
		expect(output).toEqual(input);
	});

	it('should transform using all transformations', () => {
		const output = transform(input);
		expect(output).toMatchSnapshot();
	});

	it('should transform only using specified transformations', () => {
		const output = transform(input, [transformations.loadersTransform]);
		expect(output).toMatchSnapshot();
	});

	it('should respect recast options', () => {
		const output = transform(input, undefined, {
			quote: 'double',
			trailingComma: true
		});
		expect(output).toMatchSnapshot();
	});
});
