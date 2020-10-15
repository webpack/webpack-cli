module.exports = (env) => {
    const { environment, app, file } = env;
    const customName = file && file.name && file.name.is && file.name.is.this;
    const appTitle = app && app.title;
    console.log(env);
    if (environment === 'production') {
        return {
            entry: './a.js',
            output: {
                filename: `${customName ? customName : appTitle}.js`,
            },
        };
    }
    return {};
};
