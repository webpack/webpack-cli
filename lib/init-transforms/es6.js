module.exports = (config, answer) => {
	if(!answer) return config;
	config.module
		.rule('es6')
		.test(/\.js$/)
		// Even create named loaders for later modification
		.loader('babel', 'babel-loader', {
			plugins: ['es2015']
		}).end();
	return config;
};
