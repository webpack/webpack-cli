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
    return {
        entry: './a.js',
        mode: 'development',
        stats: env.verboseStats ? 'verbose' : 'normal',
        plugins: [new DefinePlugin({ envMessage: env.envMessage ? 'env message present' : '' })],
        output: {
            filename: 'dev.js',
        },
    };
};
