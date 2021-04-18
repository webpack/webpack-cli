const { DefinePlugin } = require('webpack');

module.exports = (env) => {
    if (env.isProd) {
        return {
            entry: './a.js',
            output: {
                filename: 'prod.js',
            },
        };
    }
    if (env.foo === `''`) {
        return {
            entry: './a.js',
            output: {
                filename: 'empty-string.js',
            },
        };
    }
    return {
        entry: './a.js',
        mode: 'development',
        stats: env.verboseStats ? 'verbose' : 'normal',
        plugins: [new DefinePlugin({ envMessage: env.envMessage ? JSON.stringify('env message present') : false })],
        output: {
            filename: 'dev.js',
        },
    };
};
