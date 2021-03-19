'use strict';

const { run, hyphenToUpperCase } = require('../../utils/test-utils');
const CLI = require('../../../packages/webpack-cli/lib/index');

const cli = new CLI();
const optimizationFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('optimization-'));

describe('optimization config related flag', () => {
    optimizationFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('optimization-')[1];

        if (flag.name.includes('split-chunks')) {
            property = flag.name.split('optimization-split-chunks-')[1];
        }

        let propName = hyphenToUpperCase(property);

        if (flag.name.includes('-reset')) {
            propName = propName.split('Reset')[0];
        }

        if (flag.configs.filter((config) => config.type === 'boolean').length > 0) {
            it(`should config --${flag.name} correctly`, () => {
                if (flag.name === 'optimization-split-chunks') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`splitChunks: false`);
                } else if (flag.name.includes('reset')) {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: []`);
                } else if (flag.name === 'optimization-runtime-chunk') {
                    const { exitCode, stderr } = run(__dirname, [`--${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                } else {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.includes('reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();

                    if (flag.name === 'optimization-split-chunks') {
                        expect(stdout).toContain('splitChunks: false');
                    } else {
                        expect(stdout).toContain(`${propName}: false`);
                    }
                });
            }
        }

        // ignoring optimization-runtime-* and split-chunks-fallback-* flags because WebpackClITestPlugin logs [Object]
        // need improve the plugin to log for multi-level options i.e, optimization.runtime
        if (
            flag.configs.filter((config) => config.type === 'string').length > 0 &&
            !flag.name.includes('runtime-') &&
            !flag.name.includes('fallback-')
        ) {
            it(`should config --${flag.name} correctly`, () => {
                if (flag.name === 'optimization-split-chunks-chunks') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'initial']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`chunks: 'initial'`);
                } else if (flag.name === 'optimization-mangle-exports') {
                    const { exitCode, stderr, stdout } = run(__dirname, ['--optimization-mangle-exports', 'size']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`mangleExports: 'size'`);
                } else if (flag.name === 'optimization-used-exports') {
                    const { exitCode, stderr, stdout } = run(__dirname, ['--optimization-used-exports', 'global']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`usedExports: 'global'`);
                } else if (flag.name === 'optimization-split-chunks-default-size-types') {
                    const { exitCode, stderr, stdout } = run(__dirname, ['--optimization-split-chunks-default-size-types', 'global']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`defaultSizeTypes: [Array]`);
                } else if (flag.name === 'optimization-side-effects') {
                    const { exitCode, stderr, stdout } = run(__dirname, ['--optimization-side-effects', 'flag']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'flag'`);
                } else {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'named']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'named'`);
                }
            });
        }

        if (flag.configs.filter((config) => config.type === 'number').length > 0 && !flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name === 'optimization-split-chunks') {
                    expect(stdout).toContain(`chunks: 'async'`);
                    expect(stdout).toContain(`minChunks: 1`);
                } else {
                    expect(stdout).toContain(`${propName}: 10`);
                }
            });
        }
    });
});
