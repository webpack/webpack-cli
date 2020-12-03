const { run } = require('../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it('should support mjs config format', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.config.mjs'], false);
        console.log({ stderr, stdout });
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, 'dist/foo.bundle.js'))).toBeTruthy();
    });
});
