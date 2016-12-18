const inquirer = require('inquirer')
const questions = require('../lib/observable-questions');

/*
 * TODO: Write Tests
 */

 jest.useRealTimers()

 describe('Inquirer', function () {
	 let stdin;
	 beforeEach(function () {
		 stdin = require('mock-stdin').stdin();
	 });
	 it('Should recieve input and handle answers', function () {
		 process.nextTick(function mockResponse() {
			 stdin.send('index.js\n');
		 });
		 process.nextTick(function mockResponse() {
			 stdin.send('output.js\n');
		 });
		 inquirer.prompt(questions).ui.process.subscribe(function (response) {
			 expect(response.entryLogic).toBe('index.js')
			 expect(response.outputLogic).toBe('output.js')
		 })
	 });
 });
