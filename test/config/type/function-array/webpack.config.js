module.exports = () => [
    {
        entry: './a',
        output: {
            path: __dirname + '/binary',
            filename: 'a-functor.js',
        },
    },
    {
        entry: './b',
        output: {
            path: __dirname + '/binary',
            filename: 'b-functor.js',
        },
    },
];
