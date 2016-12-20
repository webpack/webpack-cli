const Rx = require('rx');
const {inquirerInput} = require('./utils/inquirer-types.js');
const questions = [
	inquirerInput('entryLogic','What is the name of the entry point in your application?'),
	inquirerInput('outputLogic','What is the name of the output directory in your application?')];

module.exports = Rx.Observable.from(questions);
