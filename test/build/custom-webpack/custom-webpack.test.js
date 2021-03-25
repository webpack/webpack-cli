'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('custom-webpack', () => {
    it('should use custom-webpack.js', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], {
            env: { WEBPACK_PACKAGE: resolve(__dirname, './custom-webpack.js') },
        });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
    });

    it('should throw an error for invalid-webpack.js', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], {
            env: { WEBPACK_PACKAGE: resolve(__dirname, './invalid-webpack.js') },
        });

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Error: Cannot find module`);
        expect(stdout).toBeFalsy();
    });
});
