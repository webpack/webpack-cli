'use strict';

const { run } = require('../../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe('entry flag', () => {
    it('should allow multiple entry files', (done) => {
        const { stderr, stdout } = run(__dirname, ['src/a.js', 'src/b.js', 'src/c.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            expect(data).toContain('Hello from b.js');
            expect(data).toContain('Hello from c.js');
            done();
        });
    });
});
