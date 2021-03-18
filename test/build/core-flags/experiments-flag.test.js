'use strict';

const { run, hyphenToUpperCase } = require('../../utils/test-utils');
const CLI = require('../../../packages/webpack-cli/lib/index');

const cli = new CLI();
const experimentsFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('experiments-'));

describe('experiments option related flag', () => {
    experimentsFlags.forEach((flag) => {
        // extract property name from flag name
        let property;

        if (flag.name.includes('-lazy-compilation-')) {
            property = flag.name.split('experiments-lazy-compilation-')[1];
        } else {
            property = flag.name.split('experiments-')[1];
        }

        const propName = hyphenToUpperCase(property);

        if (propName === 'client' || propName === 'test') {
            return false;
        }

        if (flag.configs.filter((config) => config.type === 'boolean').length > 0) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name.includes('-lazy-compilation-')) {
                    expect(stdout).toContain(`lazyCompilation: { ${propName}: true }`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            it(`should config --no-${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name.includes('-lazy-compilation-')) {
                    expect(stdout).toContain(`lazyCompilation: { ${propName}: false }`);
                } else {
                    expect(stdout).toContain(`${propName}: false`);
                }
            });
        }
    });
});
