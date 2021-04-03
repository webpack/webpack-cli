// eslint-disable-next-line node/no-unpublished-require
const { run, isWebpack5 } = require('../../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it('should support typescript esnext file', async () => {
        const isMacOS = process.platform === 'darwin';
        const majorNodeVersion = process.version.slice(1, 3);
        if (majorNodeVersion < 14) {
            expect(true).toBe(true);

            return;
        }

        if (isMacOS && !isWebpack5) {
            expect(true).toBe(true);

            return;
        }

        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', './webpack.config.ts'], {
            nodeOptions: ['--loader=ts-node/esm'],
            env: { WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true },
        });
        expect(stderr).not.toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, 'dist/foo.bundle.js'))).toBeTruthy();
    });
});
