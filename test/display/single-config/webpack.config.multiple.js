const { resolve } = require('path');

module.exports = {
    entry: [resolve(__dirname, 'a.js'), resolve(__dirname, 'b.js')],
};
