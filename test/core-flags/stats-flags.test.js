'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const statsFlags = flagsFromCore.filter(({ name }) => name.startsWith('stats-'));

describe('stats config related flag', () => {
    statsFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('stats-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [`--${flag.name}`]);

                expect(exitCode).toBe(0);
                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`stats: { ${option}: [] }`);
                } else {
                    expect(stdout).toContain(`stats: { ${propName}: true }`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { stdout, exitCode } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`stats: { ${propName}: false }`);
                });
            }
        }

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stdout).toContain(`stats: { ${propName}: 10 }`);
            });
        }

        if (flag.type === String) {
            const acceptsSingleValue = ['preset', 'modulesSort', 'logging', 'chunksSort', 'assetsSort'];

            it(`should config --${flag.name} correctly`, () => {
                let { stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'log']);

                expect(exitCode).toBe(0);
                if (flag.name.includes('stats-colors')) {
                    const option = flag.name.split('stats-colors-')[1];
                    stdout = run(__dirname, [`--${flag.name}`, 'u001b[32m']).stdout;

                    expect(stdout).toContain(`stats: { colors: { ${option}: 'u001b[32m' } }`);
                } else if (acceptsSingleValue.includes(propName)) {
                    expect(stdout).toContain(`stats: { ${propName}: 'log' }`);
                } else if (flag.name === 'stats-context') {
                    expect(stdout).toContain('log');
                } else if (flag.name === 'stats-entrypoints') {
                    stdout = run(__dirname, [`--${flag.name}`, 'auto']).stdout;
                    expect(stdout).toContain(`stats: { ${propName}: 'auto' }`);
                } else {
                    expect(stdout).toContain(`stats: { ${propName}: [ 'log' ] }`);
                }
            });
        }
    });
});
