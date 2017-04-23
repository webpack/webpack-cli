const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'context', 'context-0', 'path.resolve(__dirname, "app")');
defineTest(__dirname, 'context', 'context-1', '\'./some/fake/path\'');
defineTest(__dirname, 'context', 'context-2', 'contextVariable');
