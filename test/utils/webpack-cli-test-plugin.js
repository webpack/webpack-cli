class WebpackCLITestPlugin {
    constructor(options) {
        this.opts = options;
    }

    apply(compiler) {
        compiler.hooks.done.tap('webpack-cli Test Plugin', () => {
            console.log(compiler.options);
            if (this.opts) {
                this.opts.map((e) => {
                    const config = Object.getOwnPropertyDescriptor(compiler.options, e);
                    console.log(config.value);
                });
            }
        });
    }
}

module.exports = WebpackCLITestPlugin;
