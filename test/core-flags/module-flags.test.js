'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const moduleFlags = flagsFromCore.filter(({ name }) => name.startsWith('module-'));

describe('module config related flag', () => {
    moduleFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('module-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
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

        if (flag.type === String) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'value']);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 'value'`);
            });
        }
    });
});
