'use strict';

function prompt(questions, config, testAnswer) {
	return questions.reduce( function(newOpts) {
		return attachAnswers(newOpts, testAnswer);
	}, Object.assign(config, require('../../lib/utils/initial-config')))
	.map(newOpts => checkEmptyAnswers(newOpts));
}

function attachAnswers(config, answer) {
	let newConfig;
	Object.keys(config).forEach( (configName) => {
		if(answer[configName]) {
			newConfig = Object.assign(config, {
				[configName]: answer[configName]
			});
		}
	});
	return newConfig;
}

function checkEmptyAnswers(config) {
	for(let key in config) {
		if(!config[key]) {
			throw new Error('\nFound no answer given to property ' +
			key + '\n');
		}
	}
	return config;
}

module.exports = prompt;
