'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const optimizationFlags = flagsFromCore.filter(({ name }) => name.startsWith('optimization-'));

describe('optimization config related flag', () => {
    optimizationFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('optimization-')[1];
        if (flag.name.includes('split-chunks')) {
            property = flag.name.split('optimization-split-chunks-')[1];
        }
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);
                expect(stderr).toBeFalsy();
                if (flag.name === 'optimization-split-chunks') {
                    expect(stdout).toContain(`chunks: 'async'`);
                    expect(stdout).toContain(`minChunks: 1`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            it(`should config --no-${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);
                expect(stderr).toBeFalsy();
                if (flag.name === 'optimization-split-chunks') {
                    expect(stdout).toContain('splitChunks: false');
                } else {
                    expect(stdout).toContain(`${propName}: false`);
                }
            });
        }

        // ignoring optimization-runtime-* and split-chunks-fallback-* flags because WebpackClITestPlugin logs [Object]
        // need improve the plugin to log for multi-level options i.e, optimization.runtime
        if (flag.type === String && !flag.name.includes('runtime-') && !flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'named']);
                expect(stderr).toBeFalsy();
                if (flag.name === 'optimization-split-chunks-chunks') {
                    stdout = run(__dirname, [`--${flag.name}`, 'initial']).stdout;
                    expect(stdout).toContain(`chunks: 'initial'`);
                } else if (flag.name === 'optimization-mangle-exports') {
                    stdout = run(__dirname, ['--optimization-mangle-exports', 'size']).stdout;
                    expect(stdout).toContain(`mangleExports: 'size'`);
                } else if (flag.name === 'optimization-used-exports') {
                    stdout = run(__dirname, ['--optimization-used-exports', 'global']).stdout;
                    expect(stdout).toContain(`usedExports: 'global'`);
                } else {
                    expect(stdout).toContain(`${propName}: 'named'`);
                }
            });
        }

        if (flag.type === Number && !flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);
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
