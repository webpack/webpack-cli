'use strict';

const inquirer = jest.genMockFromModule('inquirer');
const Rx = require('rx');

/*
 * Optional: Should more reflect `lib/inquirer-prompt.js`
 * Optional: Should have more expects?
 *
*/
function prompt(questions) {
	return Rx.Observable.from(questions).subscribe(q => {
		expect(q.message).toContain('?');
		expect(q.type).toBe('input');
	});
}

inquirer.prompt = prompt;
module.exports = inquirer;
