const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'devtool', 'devtool-0', '\'source-map\'');
defineTest(__dirname, 'devtool', 'devtool-0', 'myVariable');
defineTest(__dirname, 'devtool', 'devtool-1', '\'cheap-module-source-map\'');
defineTest(__dirname, 'devtool', 'devtool-1', 'false');
