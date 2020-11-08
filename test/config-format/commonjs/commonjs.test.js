const { run } = require('../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it('should support CommonJS file', () => {
        const { exitCode } = run(__dirname, ['-c', 'webpack.config.cjs'], false);

        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, 'dist/foo.bundle.js'))).toBeTruthy();
    });
});
