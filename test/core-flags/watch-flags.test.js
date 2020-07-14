'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const watchFlags = flagsFromCore.filter(({ name }) => name.startsWith('watch'));

describe('watch config related flag', () => {
    watchFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('watch-options-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                expect(stderr).toBeFalsy();
                if (flag.name.includes('reset')) {
                    expect(stdout).toContain(`watchOptions: { ignored: [] }`);
                } else {
                    expect(stdout).toContain(`watchOptions: { ${propName}: true }`);
                }
            });

            it(`should config --no-${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                expect(stderr).toBeFalsy();
                if (flag.name.includes('reset')) {
                    expect(stdout).toContain('watch: false');
                } else {
                    expect(stdout).toContain(`watchOptions: { ${propName}: false }`);
                }
            });
        }

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`watchOptions: { ${propName}: 10 }`);
            });
        }

        if (flag.type === String) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'ignore.js']);
                expect(stderr).toBeFalsy();
                if (propName === 'poll') {
                    stdout = run(__dirname, [`--${flag.name}`, '10']).stdout;
                    expect(stdout).toContain(`watchOptions: { ${propName}: 10 }`);
                } else {
                    expect(stdout).toContain(`watchOptions: { ${propName}: [ 'ignore.js' ] }`);
                }
            });
        }
    });
});
