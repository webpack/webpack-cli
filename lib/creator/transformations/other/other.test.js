const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'amd', 'other-0', {amd : {
	jQuery: true,
	kQuery: false}
});
defineTest(__dirname, 'bail', 'other-0', {bail : true});
defineTest(__dirname, 'cache', 'other-0', {cache : true});
defineTest(__dirname, 'cache', 'other-0', {cache : 'cacheVal'});
defineTest(__dirname, 'profile', 'other-0', {profile : true});
