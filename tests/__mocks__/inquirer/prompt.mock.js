'use strict';

const inquirer = jest.genMockFromModule('inquirer');

function prompt(questions) {
	return questions.subscribe(q => {
		expect(q.message).toContain('?');
		expect(q.type).toBe('input');
	});
}

inquirer.prompt = prompt;
module.exports = inquirer;
