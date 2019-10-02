/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = () => {
    return {
        entry: './a',
        output: {
            path: __dirname + '/binary',
            filename: 'functor.js',
        },
    };
};
