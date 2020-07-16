'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const resolveFlags = flagsFromCore.filter(({ name }) => name.startsWith('resolve'));

describe('resolve config related flags', () => {
    resolveFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('resolve-')[1];
        if (flag.name.startsWith('resolve-loader')) {
            property = flag.name.split('resolve-loader-')[1];
        }
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean && !flag.name.includes('alias-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                expect(stderr).toBeFalsy();
                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });
        }

        if (flag.type === String && !flag.name.includes('alias-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'browser']);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: [ 'browser' ]`);
            });
        }
    });
});
