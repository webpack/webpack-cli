'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flags } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const externalsPresetsFlags = flags.filter(({ name }) => name.startsWith('externals-presets-'));

describe('externals related flag', () => {
    it('should set externals properly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--externals', './main.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externals: [ './main.js' ]`);
    });

    it('should set externalsType properly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--externals', 'var']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it('should accept --external-type values', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--externals-type', 'var']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it('should reset externals', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--externals-reset']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externals: []`);
    });

    externalsPresetsFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('externals-presets-')[1];
        const propName = hyphenToUpperCase(property);

        it(`should config --${flag.name} correctly`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`${propName}: true`);
        });

        it(`should config --no-${flag.name} correctly`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`${propName}: false`);
        });
    });
});
