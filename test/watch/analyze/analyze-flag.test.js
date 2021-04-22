'use strict';

const { runAndGetProcess, normalizeStdout, processKill } = require('../../utils/test-utils');

describe('"analyze" option', () => {
    it('should load webpack-bundle-analyzer plugin with --analyze flag', (done) => {
        const proc = runAndGetProcess(__dirname, ['--analyze']);

        proc.stdout.on('data', (chunk) => {
            const data = normalizeStdout(chunk.toString());

            if (data.includes('Webpack Bundle Analyzer is started at')) {
                expect(data).toContain('Webpack Bundle Analyzer is started at');

                processKill(proc);
                done();
            }
        });
    });
});
