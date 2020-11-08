'use strict';

const { run } = require('../utils/test-utils');

describe('externals related flag', () => {
    it('should set externals properly', () => {
        const { stdout, exitCode } = run(__dirname, ['--externals', './main.js']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`externals: [ './main.js' ]`);
    });

    it('should set externalsType properly', () => {
        const { stdout, exitCode } = run(__dirname, ['--externals', 'var']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it('should accept --external-type values', () => {
        const { stdout, exitCode } = run(__dirname, ['--externals-type', 'var']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it('should reset externals', () => {
        const { stdout, exitCode } = run(__dirname, ['--externals-reset']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`externals: []`);
    });
});
