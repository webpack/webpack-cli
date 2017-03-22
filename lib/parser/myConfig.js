const Config = require('webpack-chain');
const config = new Config();

module.exports = (opts) => {
config
	.entry('app')
	.add(opts.entry)
	.end()
	.output
	.filename(opts.output)
	return `module.exports =
	${JSON.stringify(config.toConfig())}`
}
