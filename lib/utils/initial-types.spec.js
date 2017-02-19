'use strict';

describe('initial-types', () => {

	const questions = require('./initial-questions');
	const config = require('./initial-config');

	it('should return the initial questions', () => {
		expect(questions).toMatchObject([
			{
				'message': 'What is the name of the entry point in your application?',
				'name': 'entry',
				'type': 'input'
			},
			{
				'message':
				'What is the name of the output directory in your application?',
				'name': 'output',
				'type': 'input'
			}
		]);
	});
	it('should return the initial configuration objects', () => {
		expect(config).toMatchObject({
			entry: {},
			output: {}
		});
	});

});
