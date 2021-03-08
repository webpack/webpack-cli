const path = require('path');

const compilers = ['shin-chan', 'misae', 'hiroshi', 'himawari', 'shiro'].map((name) => {
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
