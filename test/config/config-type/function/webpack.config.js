/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = () => {
    return {
        entry: './a',
        output: {
            path: __dirname + '/bin',
            filename: 'bundle.js',
        },
    };
};
