const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'context', 'context-0', {context : 'path.resolve(__dirname, "app")'});
defineTest(__dirname, 'context', 'context-1', {context : 'path.resolve(__dirname, "app")'});
