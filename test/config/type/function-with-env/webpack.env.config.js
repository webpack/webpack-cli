module.exports = (env) => {
    const {
        environment,
        app: { title },
    } = env;
    if (environment === 'production') {
        return {
            entry: './a.js',
            output: {
                filename: `${title}.js`,
            },
        };
    }
    return {};
};
