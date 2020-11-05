// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it('should support coffeescript file as flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', 'webpack.config.coffee'], false);

        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, 'dist/foo.bundle.js'))).toBeTruthy();
    });

    it('should load coffeescript file by default', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [], false);

        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, 'dist/foo.bundle.js'))).toBeTruthy();
    });
});
