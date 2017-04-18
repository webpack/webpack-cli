const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'devtool', 'devtools-0', {devtool : '\'source-map\''});
defineTest(__dirname, 'devtool', 'devtools-0', {devtool : '\'cheap-module-source-map\''});
defineTest(__dirname, 'devtool', 'devtools-0', {devtool : 'myVariable'});
defineTest(__dirname, 'devtool', 'devtools-0', {devtool : 'false'});
