const { DefinePlugin } = require('webpack');

module.exports = (env) => {
    console.log({ env });
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
        plugins: [new DefinePlugin({ envMessage: env.envMessage ? JSON.stringify('env message present') : false })],
        output: {
            filename: 'dev.js',
        },
    };
};
