module.exports = [
    () => {
        return {
            entry: './a',
            output: {
                path: __dirname + '/binary',
                filename: 'a-functor.js',
            },
        };
    },
    () => {
        return {
            entry: './b',
            output: {
                path: __dirname + '/binary',
                filename: 'b-functor.js',
            },
        };
    },
];
