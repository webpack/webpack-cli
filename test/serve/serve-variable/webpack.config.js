class CustomTestPlugin {
    constructor(isInEnvironment) {
        this.isInEnvironment = isInEnvironment;
    }
    apply(compiler) {
        compiler.hooks.done.tap('testPlugin', () => {
            if (process.env.WEBPACK_SERVE && this.isInEnvironment) {
                console.log('PASS');
            } else {
                console.log('FAIL');
            }
        });
    }
}

module.exports = (env) => {
    return {
        mode: 'development',
        devtool: false,
        plugins: [new CustomTestPlugin(env.process.env.WEBPACK_SERVE)],
    };
};
