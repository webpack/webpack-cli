module.exports = [
    {
        name: 'first',
        watch: true,
        stats: 'none',
        plugins: [
            {
                apply(compiler) {
                    (compiler.webpack ? compiler.hooks.afterDone : compiler.hooks.done).tap('webpack-cli-test', () => {
                        console.log(`first compiled`);
                    });
                },
            },
        ],
    },
    {
        name: 'two',
        watch: true,
        stats: 'none',
        plugins: [
            {
                apply(compiler) {
                    (compiler.webpack ? compiler.hooks.afterDone : compiler.hooks.done).tap('webpack-cli-test', () => {
                        console.log(`second compiled`);
                    });
                },
            },
        ],
    },
];
