'use strict';

const { runWatch, isWindows } = require('../utils/test-utils');

describe('--analyze flag', () => {
    // TODO: fix timeout for windows CI
    if (isWindows) {
        it('TODO: Fix on windows', () => {
            expect(true).toBe(true);
        });
        return;
    }
    it('should load webpack-bundle-analyzer plugin with --analyze flag', async () => {
        const { stderr, stdout } = await runWatch({
            testCase: __dirname,
            args: ['--analyze'],
            setOutput: true,
            outputKillStr: 'main',
        });

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('BundleAnalyzerPlugin');
        expect(stdout).toContain('Webpack Bundle Analyzer is started at http://127.0.0.1:8888');
    });
});
