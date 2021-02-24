'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const CLI = require('../../packages/webpack-cli/lib/index');

const cli = new CLI();
const statsFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('stats-'));

describe('stats config related flag', () => {
    statsFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('stats-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: false`);
                });
            }
        }

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.type === String) {
            const acceptsSingleValue = ['preset', 'modulesSort', 'logging', 'chunksSort', 'assetsSort'];

            it(`should config --${flag.name} correctly`, () => {
                if (flag.name.includes('stats-colors')) {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'u001b[32m']);
                    const option = flag.name.split('stats-colors-')[1];

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`colors: { ${option}: 'u001b[32m' }`);
                } else if (acceptsSingleValue.includes(propName)) {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'log']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'log'`);
                } else if (flag.name === 'stats-context') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'log']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('log');
                } else if (flag.name === 'stats-entrypoints' || flag.name === 'stats-error-details') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'auto']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'auto'`);
                } else {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'log']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'log' ]`);
                }
            });
        }
    });
});
