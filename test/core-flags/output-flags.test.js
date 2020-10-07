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
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                if (flag.name === 'output-module') {
                    //'output.module: true' is only allowed when 'experiments.outputModule' is enabled
                    stdout = run(__dirname, [`--${flag.name}`, '--experiments-output-module']).stdout;
                    expect(stdout).toContain('module: true');
                } else if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: false`);
                });
            }
        }

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.type === String && !flag.name.includes('output-library')) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'test']);

                if (flag.name === 'output-cross-origin-loading') {
                    stdout = run(__dirname, [`--${flag.name}`, 'anonymous']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'anonymous'`);
                } else if (flag.name === 'output-chunk-format') {
                    stdout = run(__dirname, [`--${flag.name}`, 'commonjs']).stdout;

                    expect(stdout).toContain(`${propName}: 'commonjs'`);
                } else if (flag.name === 'output-enabled-library-types') {
                    stdout = run(__dirname, [`--${flag.name}`, 'global']).stdout;

                    expect(stdout).toContain(`${propName}: [ 'global' ]`);
                } else if (flag.name === 'output-chunk-loading') {
                    stdout = run(__dirname, [`--${flag.name}`, 'jsonp']).stdout;

                    expect(stdout).toContain(`${propName}: 'jsonp'`);
                } else if (flag.name === 'output-enabled-chunk-loading-types' || flag.name === 'output-enabled-wasm-loading-types') {
                    stdout = run(__dirname, [`--${flag.name}`, 'async-node']).stdout;

                    expect(stdout).toContain(`${propName}: [ 'async-node' ]`);
                } else if (flag.name === 'output-enabled-library-type') {
                    stdout = run(__dirname, [`--${flag.name}`, 'amd']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'amd'`);
                } else if (flag.name === 'output-hash-function') {
                    stdout = run(__dirname, [`--${flag.name}`, 'sha256']).stdout;
                    stderr = run(__dirname, [`--${flag.name}`, 'sha256']).stderr;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`hashFunction: 'sha256'`);
                } else if (flag.name === 'output-script-type') {
                    stdout = run(__dirname, [`--${flag.name}`, 'module']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'module'`);
                } else if (flag.name === 'output-enabled-library-types') {
                    stdout = run(__dirname, [`--${flag.name}`, 'var']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'var' ]`);
                } else if (flag.name === 'output-path') {
                    expect(stdout).toContain('test');
                } else if (flag.name === 'output-worker-chunk-loading') {
                    stdout = run(__dirname, [`--${flag.name}`, 'async-node']).stdout;
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else if (flag.name === 'output-worker-chunk-loading') {
                    stdout = run(__dirname, [`--${flag.name}`, 'async-node']).stdout;
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else if (flag.name === 'output-chunk-format') {
                    stdout = run(__dirname, [`--${flag.name}`, 'commonjs']).stdout;
                    expect(stdout).toContain(`${propName}: 'commonjs'`);
                } else if (flag.name.includes('wasm')) {
                    stdout = run(__dirname, [`--${flag.name}`, 'async-node']).stdout;
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else {
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'test'`);
                }
            });
        }

        if (flag.name.includes('output-library')) {
            it(`should config name, type and export  correctly`, () => {
                const { stderr, stdout } = run(__dirname, [
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

                expect(stderr).toBeFalsy();
                expect(stdout).toContain('myLibrary');
                expect(stdout).toContain(`type: 'var'`);
                expect(stdout).toContain('export: [Array]');
                expect(stdout).toContain(`auxiliaryComment: 'comment'`);
                expect(stdout).toContain('umdNamedDefine: true');
            });

            it('should be succesful with --output-library-reset correctly', () => {
                const { stderr, stdout } = run(__dirname, ['--output-library-reset']);

                expect(stderr).toBeFalsy();
                expect(stdout).toContain('name: []');
            });
        }
    });
});
