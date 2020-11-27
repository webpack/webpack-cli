'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flags } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const moduleFlags = flags.filter(({ name }) => name.startsWith('module-'));

describe('module config related flag', () => {
    moduleFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('module-')[1];
        if (property.includes('rules-') && property !== 'rules-reset') {
            property = flag.name.split('rules-')[1];
        }
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean && !flag.name.includes('module-no-parse')) {
            it(`should config --${flag.name} correctly`, () => {
                if (flag.name.includes('-reset')) {
                    const { stderr, stdout, exitCode } = run(__dirname, [`--${flag.name}`]);
                    const option = propName.split('Reset')[0];

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${option}: []`);
                } else if (flag.name.includes('rules-')) {
                    const { stderr, stdout, exitCode } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain("sideEffects: 'flag'");
                } else {
                    const { stderr, stdout, exitCode } = run(__dirname, [`--${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { stderr, stdout, exitCode } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    if (flag.name.includes('rules-')) {
                        expect(stdout).toContain('sideEffects: false');
                    } else {
                        expect(stdout).toContain(`${propName}: false`);
                    }
                });
            }
        }

        if (flag.type === String) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'value']);

                if (flag.name === 'module-no-parse') {
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('value');
                } else if (flag.name.includes('reg-exp')) {
                    ({ stdout, stderr, exitCode } = run(__dirname, [`--${flag.name}`, '/ab?c*/']));

                    expect(stderr).toBeFalsy();
                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: /ab?c*/`);
                } else if (flag.name.includes('module-rules-')) {
                    ({ stdout, stderr, exitCode } = run(__dirname, [`--${flag.name}`, 'javascript/auto']));

                    if (propName === 'use' || propName === 'type') {
                        expect(stdout).toContain(`${propName}: 'javascript/auto'`);
                    } else if (property.includes('use-')) {
                        stdout = run(__dirname, ['--module-rules-use-loader', 'myLoader']).stdout;
                        expect(stdout).toContain(`use: [Object]`);
                    } else if (propName === 'enforce') {
                        stdout = run(__dirname, [`--${flag.name}`, 'pre', '--module-rules-use-loader', 'myLoader']).stdout;
                        expect(stdout).toContain(`${propName}: 'pre'`);
                    } else {
                        stdout = run(__dirname, [`--${flag.name}`, '/rules-value']).stdout;
                        expect(stdout).toContain('rules-value');
                    }
                } else {
                    expect(stdout).toContain(`${propName}: 'value'`);
                    expect(exitCode).toBe(0);
                }
            });
        }
    });
});
