const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'entry', 'entry-0', '\'index.js\'');
defineTest(__dirname, 'entry', 'entry-0', ['\'index.js\'', '\'app.js\'']);
defineTest(__dirname, 'entry', 'entry-0', {
	index: '\'index.js\'',
	app: '\'app.js\''
});

defineTest(__dirname, 'entry', 'entry-0', {
	inject: 'something',
	app: '\'app.js\'',
	inject_1: 'else'
});
defineTest(__dirname, 'entry', 'entry-0', '() => \'index.js\'');
defineTest(__dirname, 'entry', 'entry-0', '() => new Promise((resolve) => resolve([\'./app\', \'./router\']))');
defineTest(__dirname, 'entry', 'entry-0', 'entryStringVariable');
