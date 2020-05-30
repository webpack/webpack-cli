module.exports = (env) => {
    if (env === 'isProd') {
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
        output: {
            filename: 'dev.js',
        },
    };
};
