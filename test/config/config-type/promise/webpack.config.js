/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = () => {
    return new Promise(resolve => {
        resolve({
            entry: './a',
            output: {
                path: __dirname + '/bin',
                filename: 'bundle.js',
            },
        });
    });
};
