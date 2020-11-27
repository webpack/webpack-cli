'use strict';

const { run, runAndGetWatchProc } = require('../utils/test-utils');

describe('--analyze flag', () => {
    it('should load webpack-bundle-analyzer plugin with --analyze flag', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--analyze'], false, '', true);

        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();

            if (data.includes('Webpack Bundle Analyzer is started at')) {
                expect(data).toContain('Webpack Bundle Analyzer is started at');

                proc.kill();
                done();
            }
        });
    });

    it('should not load webpack-bundle-analyzer plugin twice with --analyze flag and plugin', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './analyze.config.js', '--analyze']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Webpack Bundle Analyzer saved report to');
        expect(stdout.match(/Webpack Bundle Analyzer saved report to/g)).toHaveLength(1);
    });
});
