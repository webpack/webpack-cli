const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'entry', 'entry-0', {entry: 'index.js'});
defineTest(__dirname, 'entry', 'entry-0', {entry: ['index.js', 'app.js']});
