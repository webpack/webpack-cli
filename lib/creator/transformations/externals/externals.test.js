const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'externals', 'externals-0', {externals: /react/});
defineTest(__dirname, 'externals', 'externals-1', {externals: {
	jquery: '\'jQuery\'',
	react: '\'react\''
}});

defineTest(__dirname, 'externals', 'externals-1', {externals: 'myObj'});

defineTest(__dirname, 'externals', 'externals-1', {externals: {
	jquery: '\'jQuery\'',
	react: 'reactObj'
}});

defineTest(__dirname, 'externals', 'externals-1', {externals: {
	jquery: '\'jQuery\'',
	react: ['reactObj', 'path.join(__dirname, \'app\')', '\'jquery\'']
}});

defineTest(__dirname, 'externals', 'externals-1', {externals: {
	lodash: {
		commonjs: '\'lodash\'',
		amd: '\'lodash\'',
		root: '\'_\''
	}
}});

defineTest(__dirname, 'externals', 'externals-1', {externals: {
	lodash: {
		commonjs: 'lodash',
		amd: 'hidash',
		root: '_'
	}
}});

defineTest(__dirname, 'externals', 'externals-1', {externals: [
	{
		a: 'false',
		b: 'true',
		'\'./ext\'': './hey'
	},
	'function(context, request, callback) {' +
	'if (/^yourregex$/.test(request)){' +
	'return callback(null, \'commonjs \' + request);' +
	'}' +
	'callback();' +
	'}'
]
});

defineTest(__dirname, 'externals', 'externals-1', {externals: [
	'myObj',
	'function(context, request, callback) {' +
	'if (/^yourregex$/.test(request)){' +
	'return callback(null, \'commonjs \' + request);' +
	'}' +
	'callback();' +
	'}'
]
});
