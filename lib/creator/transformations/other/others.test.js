const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'amd', 'others-0', {amd : {
	jQuery: true,
	kQuery: false}
});
defineTest(__dirname, 'bail', 'others-0', {bail : true});
