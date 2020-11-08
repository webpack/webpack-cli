'use strict';

const stripAnsi = require('strip-ansi');
const { runAndGetWatchProc } = require('../utils/test-utils');

describe('--analyze flag', () => {
    it('should load webpack-bundle-analyzer plugin with --analyze flag', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--analyze'], false, '', true);

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());
            const str = 'Webpack Bundle Analyzer is started at';

            if (data.includes(str)) {
                expect(data).toContain(str);

                proc.kill();
                done();
            }
        });
    });
});
