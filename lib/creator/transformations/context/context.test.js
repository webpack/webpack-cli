const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'context', 'context-0', {context : 'path.resolve(__dirname, "app")'});
defineTest(__dirname, 'context', 'context-1', {context : '\'./some/fake/path\''});
defineTest(__dirname, 'context', 'context-2', {context : 'contextVariable'});
