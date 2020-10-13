module.exports = (env) => {
    const { environment } = env;
    if (environment === 'production') {
        return {
            entry: './a.js',
            output: {
                filename: 'prod.js',
            },
        };
    }
    return {};
};
