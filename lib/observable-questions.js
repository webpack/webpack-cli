const Rx = require('rx');
const {inquirerInput} = require('./utils/inquirer-types.js');

module.exports = Rx.Observable.create( (obs) => {
	obs.next(inquirerInput('entryLogic',
	'What is the name of the entry point in your application?'
	));
	obs.next(inquirerInput('outputLogic',
	'What is the name of the output directory in your application?'
	));
	obs.onCompleted();
});
