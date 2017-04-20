const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'devtool', 'devtool-0', {devtool : '\'source-map\''});
defineTest(__dirname, 'devtool', 'devtool-0', {devtool : 'myVariable'});
defineTest(__dirname, 'devtool', 'devtool-1', {devtool : '\'cheap-module-source-map\''});
defineTest(__dirname, 'devtool', 'devtool-1', {devtool : 'false'});
