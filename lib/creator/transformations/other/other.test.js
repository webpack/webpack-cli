const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'amd', 'other-0', {
	jQuery: true,
	kQuery: false}
);
defineTest(__dirname, 'bail', 'other-0', true);
defineTest(__dirname, 'cache', 'other-0', true);
defineTest(__dirname, 'cache', 'other-0', 'cacheVal');
defineTest(__dirname, 'profile', 'other-0', true);
defineTest(__dirname, 'merge', 'other-0', 'myConfig');
