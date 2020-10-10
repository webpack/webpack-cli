module.exports = (usingDefaults) => {
    const scripts = {
        build: 'webpack',
    };
    if (usingDefaults) {
        scripts.start = 'webpack-dev-server';
    }

    return {
        version: '1.0.0',
        description: 'My webpack project',
        name: 'my-webpack-project',
        scripts,
    };
};
