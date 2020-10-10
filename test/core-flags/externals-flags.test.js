'use strict';

const { run } = require('../utils/test-utils');

describe('externals related flag', () => {
    it('should set externals properly', () => {
        const { stderr, stdout } = run(__dirname, ['--externals', './main.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externals: [ './main.js' ]`);
    });

    it('should set externalsType properly', () => {
        const { stderr, stdout } = run(__dirname, ['--externals', 'var']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it('should accept --external-type values', () => {
        const { stderr, stdout } = run(__dirname, ['--externals-type', 'var']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it('should reset externals', () => {
        const { stderr, stdout } = run(__dirname, ['--externals-reset']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externals: []`);
    });
});
