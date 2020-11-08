'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const outputFlags = flagsFromCore.filter(({ name }) => name.startsWith('output-'));

describe('output config related flag', () => {
    outputFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('output-')[1];
        if (property.includes('environment-')) {
            property = property.split('environment-')[1];
        }
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean && !flag.name.includes('output-library')) {
            it(`should config --${flag.name} correctly`, () => {
                let { stdout, exitCode } = run(__dirname, [`--${flag.name}`]);

                if (flag.name === 'output-module') {
                    //'output.module: true' is only allowed when 'experiments.outputModule' is enabled
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, '--experiments-output-module']));
                    expect(exitCode).toBe(0);
                    expect(stdout).toContain('module: true');
                } else if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];

                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { stdout, exitCode } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: false`);
                });
            }
        }

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.type === String && !flag.name.includes('output-library')) {
            it(`should config --${flag.name} correctly`, () => {
                let { stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'test']);

                if (flag.name === 'output-cross-origin-loading') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'anonymous']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: 'anonymous'`);
                } else if (flag.name === 'output-chunk-format') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'commonjs']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: 'commonjs'`);
                } else if (flag.name === 'output-chunk-loading') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'jsonp']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: 'jsonp'`);
                } else if (flag.name === 'output-enabled-chunk-loading-types' || flag.name === 'output-enabled-wasm-loading-types') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'async-node']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: [ 'async-node' ]`);
                } else if (flag.name === 'output-enabled-library-type') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'amd']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: 'amd'`);
                } else if (flag.name === 'output-hash-function') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'sha256']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`hashFunction: 'sha256'`);
                } else if (flag.name === 'output-script-type') {
                    ({ stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'module']));

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: 'module'`);
                } else if (flag.name === 'output-enabled-library-types') {
                    stdout = run(__dirname, [`--${flag.name}`, 'var']).stdout;

                    expect(stdout).toContain(`${propName}: [ 'var' ]`);
                } else if (flag.name === 'output-path') {
                    expect(stdout).toContain('test');
                } else if (flag.name === 'output-worker-chunk-loading') {
                    stdout = run(__dirname, [`--${flag.name}`, 'async-node']).stdout;
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else if (flag.name.includes('wasm')) {
                    stdout = run(__dirname, [`--${flag.name}`, 'async-node']).stdout;
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else {
                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`${propName}: 'test'`);
                }
            });
        }

        if (flag.name.includes('output-library')) {
            it(`should config name, type and export  correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [
                    '--output-library-name',
                    'myLibrary',
                    '--output-library-type',
                    'var',
                    '--output-library-export',
                    'myExport',
                    '--output-library-auxiliary-comment',
                    'comment',
                    '--output-library-umd-named-define',
                ]);

                expect(exitCode).toBe(0);
                expect(stdout).toContain('myLibrary');
                expect(stdout).toContain(`type: 'var'`);
                expect(stdout).toContain('export: [Array]');
                expect(stdout).toContain(`auxiliaryComment: 'comment'`);
                expect(stdout).toContain('umdNamedDefine: true');
            });

            it('should be succesful with --output-library-reset correctly', () => {
                const { stdout, exitCode } = run(__dirname, ['--output-library-reset']);

                expect(exitCode).toBe(0);
                expect(stdout).toContain('name: []');
            });
        }
    });
});
