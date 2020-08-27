'use strict';

const { existsSync } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('merge flag configuration', () => {
    it('merges two configurations together', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--config', './1.js', '-c', './2.js', '--merge'], false);
        expect(stdout).not.toContain('option has not been set, webpack will fallback to');
        expect(existsSync(resolve(__dirname, './dist/merged.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
    });
    it('merges two configurations together with flag alias', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--config', './1.js', '--config', './2.js', '-m'], false);
        expect(stdout).toContain('merged.js');
        expect(existsSync(resolve(__dirname, './dist/merged.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
    });
    it('fails when there are less than 2 configurations to merge', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--config', './1.js', '-m'], false);
        expect(stderr).toContain(`MergeError: Atleast two configurations are required for merge.`);
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });
});
