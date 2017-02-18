/* eslint-disable */
'use strict';
const Rx = require('rx');
const inquirer = jest.genMockFromModule('inquirer');

function prompt(questions, config, testAnswer) {
 	return questions.reduce(function (newOpts, ans) {
		return attachAnswers(newOpts, testAnswer);
	}, Object.assign(config, require('../../../lib/utils/initial-config')))
  	.map(newOpts => {
		return checkEmptyAnswers(newOpts);
	});
}

function attachAnswers(config, ans) {
	Object.keys(config).forEach( (configName) => {
		if(ans[configName]) {
			config = Object.assign(config, {
				[configName]: ans[configName]
			});
		}
	});
	return config;
}

function checkEmptyAnswers(config) {
	let errors = [];
	for(let key in config) {
		if(!config[key]) {
			errors[key] = '\nFound no answer given to property ' +
			key + '\n';
		}
	}
	// get errors and use filter to discard the process after we've logged each error
	Object.keys(errors).map( (err) => {
		throw new Error(errors[err]);
	});

	return config;
}

module.exports = prompt;
