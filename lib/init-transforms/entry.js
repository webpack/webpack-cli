const run = (config, answer) => {
	config.entry('index').add(answer).end();
	return config;
};

module.exports = run;
