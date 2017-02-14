function inquirerInput(name, message) {
	return ({
		type: 'input',
		name: name,
		message: message
	});
}
const questions = [
	inquirerInput('entry','What is the name of the entry point in your application?'),
	inquirerInput('output','What is the name of the output directory in your application?')
];

module.exports = questions;
