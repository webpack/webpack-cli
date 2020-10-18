module.exports = [
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                entry: './a',
                output: {
                    path: __dirname + '/binary',
                    filename: 'a-promise.js',
                },
            });
        }, 0);
    }),
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                entry: './b',
                output: {
                    path: __dirname + '/binary',
                    filename: 'b-promise.js',
                },
            });
        }, 0);
    }),
];
