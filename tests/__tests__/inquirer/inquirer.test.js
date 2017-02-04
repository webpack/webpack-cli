'use strict';

const inquirer = require('prompt.mock'); // eslint-disable-line
const questions = require('../../../lib/utils/observable-questions');


/*
 * We need more tests here, look at the mock where this comes from.
 * We should mock an exact copy of `lib/inquirer-prompt.js` and have more tests based on that.
 */

describe('Inquirer', () => {
	it('Should recieve input and handle answers', () => {
		inquirer.prompt(questions);
	});
});
