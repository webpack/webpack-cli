/*
* @function inquirerInput
*
* Utility function for inquirer to add an question to a inquirer
* instance
*
* @param { String } name - The name of the question
* @param { String } message - The question to be asked
* @returns { <Object> } - returns an inquirer question
*/

function inquirerInput(name, message) {
	return ({
		type: 'input',
		name: name,
		message: message
	});
}
/*
* @array questions
*
* Adds the initial questions from the utility function above as an array.
*
*/

const questions = [
	inquirerInput('entry','What is the name of the entry point in your application?'),
	inquirerInput('outputPath','What is the name of the output directory in your application?'),
	inquirerInput('outputFileName', 'What is the name of the output file?'),
	// TODO this needs to be boolean
	inquirerInput('es6', 'Will you be using ES6?')
];

module.exports = questions;
