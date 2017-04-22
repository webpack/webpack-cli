const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'amd', 'others-0', {amd : {
	jQuery: true,
	kQuery: false}
});
defineTest(__dirname, 'bail', 'others-0', {bail : true});
defineTest(__dirname, 'cache', 'others-0', {cache : true});
defineTest(__dirname, 'cache', 'others-0', {cache : 'cacheVal'});
defineTest(__dirname, 'profile', 'others-0', {profile : true});
