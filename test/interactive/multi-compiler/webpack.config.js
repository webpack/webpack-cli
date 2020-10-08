const path = require('path');

const compilers = ['1', '2', '3', '4', '5'].map((name) => {
    return {
        name: name,
        mode: 'development',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: `main-${name}.js`,
        },
    };
});

module.exports = compilers;
