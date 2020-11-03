class CustomTestPlugin {
    apply(compiler) {
        compiler.hooks.beforeCompile.tap('testPlugin', () => {
            if (process.env.WEPACK_SERVE) {
                console.log('Variable Defined!');
            } else {
                console.log('Not Defined');
            }
        });
    }
}

module.exports = {
    mode: 'development',
    devtool: false,
    plugins: [new CustomTestPlugin()],
};
