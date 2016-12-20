'use strict';

var inquirer = require('prompt_mock');
var questions = require('../../lib/observable-questions');

describe('Inquirer', function () {
	it('Should recieve input and handle answers', function () {
		inquirer.prompt(questions)
	});
});
