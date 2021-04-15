module.exports = (env, argv) => {
    const { mode } = argv;
    return {
        entry: './a.js',
        output: {
            filename: mode === 'production' ? 'prod.js' : 'dev.js',
        },
    };
};
