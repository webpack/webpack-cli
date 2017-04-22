const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'target', 'target-0', {target : '\'async-node\''});
defineTest(__dirname, 'target', 'target-1', {target : 'node'});
