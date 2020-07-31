'use strict';
const { existsSync } = require('fs');
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
    it('is able to understand multiple env flags', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isDev', '--env', 'verboseStats']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(stdout).toContain('LOG from webpack.buildChunkGraph.visitModules');
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/dev.js'))).toBeTruthy();
    });
});
