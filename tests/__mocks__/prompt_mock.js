'use strict';

const inquirer = jest.genMockFromModule('inquirer')

function prompt(questions, spec) {
	 return questions.subscribe(q => {
			 expect(q.message).toContain('?')
			 expect(q.name).toContain('Logic')
			 expect(q.type).toBe('input')
	 })
}

inquirer.prompt = prompt;
module.exports = inquirer;
