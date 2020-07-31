'use strict';
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function configuration', () => {
    it('is able to understand a configuration file as a function', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isProd']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/prod.js'))).toBeTruthy();
    });
    it('is able to understand a configuration file as a function', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isDev']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/dev.js'))).toBeTruthy();
    });
    it('is able to understand multiple env flags', (done) => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isDev', '--env', 'verboseStats', '--env', 'envMessage']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // check that the verbose env is respected
        expect(stdout).toContain('LOG from webpack.buildChunkGraph.visitModules');
        // check if the values from DefinePlugin make it to the compiled code
        readFile(resolve(__dirname, './bin/dev.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('env message present');
            done();
        });
    });
});
