'use strict';
const { run } = require('../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');

describe('--interactive flag', () => {
    it('should add InteractiveModePlugin to config', (done) => {
        const { stderr, stdout } = run(__dirname, ['--interactive']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('InteractiveModePlugin');
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
