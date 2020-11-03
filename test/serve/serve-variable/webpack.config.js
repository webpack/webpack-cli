const isInProcess = process.env.WEBPACK_SERVE;

class CustomTestPlugin {
    constructor(isInEnvironment) {
        this.isInEnvironment = isInEnvironment;
    }
    apply(compiler) {
        compiler.hooks.done.tap('testPlugin', () => {
            if (isInProcess && this.isInEnvironment) {
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
