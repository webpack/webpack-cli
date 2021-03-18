'use strict';

const { run, hyphenToUpperCase } = require('../../utils/test-utils');
const CLI = require('../../../packages/webpack-cli/lib/index');

const cli = new CLI();
const watchFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('watch'));

describe('watch config related flag', () => {
    watchFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('watch-options-')[1];
        const propName = hyphenToUpperCase(property);

        if (propName === 'stdin') {
            return;
        }

        if (flag.configs.filter((config) => config.type === 'boolean').length > 0 && flag.name !== 'watch') {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                console.log(stdout);
                console.log(stderr);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name.includes('reset')) {
                    expect(stdout).toContain(`watchOptions: { ignored: [] }`);
                } else {
                    expect(stdout).toContain(`watchOptions: { ${propName}: true }`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`watchOptions: { ${propName}: false }`);
                });
            }
        }

        if (flag.configs.filter((config) => config.type === 'number').length > 0) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`watchOptions: { ${propName}: 10 }`);
            });
        }

        if (flag.configs.filter((config) => config.type === 'string').length > 0) {
            it(`should config --${flag.name} correctly`, () => {
                if (propName === 'poll') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '200']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`watchOptions: { ${propName}: 200 }`);
                } else {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'ignore.js']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`watchOptions: { ${propName}: [ 'ignore.js' ] }`);
                }
            });
        }
    });
});
