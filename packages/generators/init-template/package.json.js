module.exports = (isUsingDevServer) => {
    const scripts = {
        build: 'webpack',
    };
    if (isUsingDevServer) {
        scripts.serve = 'webpack serve';
    }

    return {
        version: '1.0.0',
        description: 'My webpack project',
        name: 'my-webpack-project',
        scripts,
    };
};
