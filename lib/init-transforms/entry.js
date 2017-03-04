const run = (config, answer) => {
	config.entry(answer).end();
	return config;
};

module.exports = run;
