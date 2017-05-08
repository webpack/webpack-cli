const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'top-scope', 'top-scope-0', [
	'var test = \'me\';'
]);
