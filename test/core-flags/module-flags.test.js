'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const moduleFlags = flagsFromCore.filter(({ name }) => name.startsWith('module-'));

describe('module config related flag', () => {
    moduleFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('module-')[1];
        const propName = hyphenToUpperCase(property);

        //TODO: improve webpackCLITestPlugin for testing of nested options
        // i.e, module-rules-* flags, right now it logs rules: [Object] only.
        if (flag.type === Boolean && !flag.name.includes('rules-') && !flag.name.includes('module-no-parse')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);
                expect(stderr).toBeFalsy();
                if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            it(`should config --no-${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);
                expect(stderr).toBeFalsy();
                if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: false`);
                }
            });
        }

        if (flag.type === String && !flag.name.includes('rules-')) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'value']);
                expect(stderr).toBeFalsy();
                if (flag.name === 'module-no-parse') {
                    expect(stdout).toContain('value');
                } else if (flag.name.includes('reg-exp')) {
                    stdout = run(__dirname, [`--${flag.name}`, '/ab?c*/']).stdout;
                    expect(stdout).toContain(`${propName}: /ab?c*/`);
                } else {
                    expect(stdout).toContain(`${propName}: 'value'`);
                }
            });
        }
    });
});
