class WebpackCLITestPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('webpack-cli Test Plugin', () => {
            console.log(compiler.options);
        });
    }
}

module.exports = WebpackCLITestPlugin;
