'use strict';

const inquirer = require('prompt.mock'); // eslint-disable-line
const questions = require('../../../lib/utils/observable-questions');

describe('Inquirer', () => {
	it('Should recieve input and handle answers', () => {
		inquirer.prompt(questions);
	});
});
