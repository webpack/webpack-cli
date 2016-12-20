'use strict';

const inquirer = require('prompt_mock');
const questions = require('../../lib/observable-questions');

describe('Inquirer', function () {
	it('Should recieve input and handle answers', function () {
		inquirer.prompt(questions)
	});
});
