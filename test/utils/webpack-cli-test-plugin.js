class WebpackCLITestPlugin {
    constructor(options, showAll = true) {
        this.opts = options;
        this.showAll = showAll;
    }

    apply(compiler) {
        compiler.hooks.done.tap('webpack-cli Test Plugin', () => {
            if (this.showAll) {
                console.log(compiler.options);
            }
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
