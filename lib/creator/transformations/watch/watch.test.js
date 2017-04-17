const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'watch', 'watch-0', {watch : true});
defineTest(__dirname, 'watch', 'watch-0', {watch : false});
defineTest(__dirname, 'watch', 'watch-1', {watch : true});
defineTest(__dirname, 'watch', 'watch-1', {watch : false});
