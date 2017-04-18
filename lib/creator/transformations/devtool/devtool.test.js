const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'devtool', 'devtools-0', {devtool : '\'source-map\''});
defineTest(__dirname, 'devtool', 'devtools-1', {devtool : '\'cheap-module-source-map\''});
defineTest(__dirname, 'devtool', 'devtools-2', {devtool : 'myVariable'});
