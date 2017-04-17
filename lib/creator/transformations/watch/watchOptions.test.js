const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'watchOptions', 'watch-0', {watchOptions : {
	aggregateTimeout: 300,
	poll: 1000,
	ignored: '/node_modules/'
}});

defineTest(__dirname, 'watchOptions', 'watch-1', {watchOptions : {
	aggregateTimeout: 300,
	poll: 1000,
	ignored: '/node_modules/'
}});

defineTest(__dirname, 'watchOptions', 'watch-2', {watchOptions : {
	aggregateTimeout: 300,
	poll: 1000,
	ignored: '/node_modules/'
}});
