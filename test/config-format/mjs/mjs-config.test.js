const { run } = require('../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it('should support mjs file', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.config.mjs'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        console.log({ stderr, stdout });
        expect(existsSync(resolve(__dirname, 'dist/foo.bundle.js'))).toBeTruthy();
    });
});
