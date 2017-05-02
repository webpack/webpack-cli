const Input = require('webpack-addons').Input;

module.exports = (self, answer) => {
	return new Promise( (resolve) => {
		let webpackOutputPoint = {};
		self.prompt([
			Input('outputPropTypes', 'write your values of these properties seperated by comma')
		]).then( (outputPropAnswer) => {
			const outputAnswers = outputPropAnswer['outputPropTypes'].split(',');
			for(let i = 0; i < answer.length; i++) {
				webpackOutputPoint[answer[i]] =  '\'' + outputAnswers[i] + '\'';
			}
			resolve(webpackOutputPoint);
		});
	});
};
