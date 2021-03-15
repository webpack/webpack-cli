'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const CLI = require('../../packages/webpack-cli/lib/index');

const cli = new CLI();
const outputFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('output-'));

describe('output config related flag', () => {
    outputFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('output-')[1];

        if (property.includes('environment-')) {
            property = property.split('environment-')[1];
        } else if (property.includes('clean-')) {
            property = property.split('clean-')[1];
        }

        const propName = hyphenToUpperCase(property);

        if (flag.configs.filter((config) => config.type === 'boolean').length > 0 && !flag.name.includes('output-library')) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout, exitCode } = run(__dirname, [`--${flag.name}`]);

                if (flag.name === 'output-module') {
                    //'output.module: true' is only allowed when 'experiments.outputModule' is enabled
                    ({ exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '--experiments-output-module']));

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('module: true');
                } else if (flag.name === 'output-strict-module-error-handling') {
                    ({ exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '--hot']));

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                } else if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset') && !flag.name.includes('output-strict-module-error-handling')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: false`);
                });
            }
        }

        if (flag.configs.filter((config) => config.type === 'number').length > 0) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.configs.filter((config) => config.type === 'string').length > 0 && !flag.name.includes('output-library')) {
            it(`should config --${flag.name} correctly`, () => {
                if (flag.name === 'output-cross-origin-loading') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'anonymous']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'anonymous'`);
                } else if (flag.name === 'output-chunk-format') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'commonjs']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'commonjs'`);
                } else if (flag.name === 'output-chunk-loading') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'jsonp']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'jsonp'`);
                } else if (flag.name === 'output-enabled-chunk-loading-types' || flag.name === 'output-enabled-wasm-loading-types') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'async-node']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'async-node' ]`);
                } else if (flag.name === 'output-enabled-library-type') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'amd']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'amd'`);
                } else if (flag.name === 'output-hash-function') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'sha256']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`hashFunction: 'sha256'`);
                } else if (flag.name === 'output-script-type') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'module']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'module'`);
                } else if (flag.name === 'output-enabled-library-types') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'var']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'var' ]`);
                } else if (flag.name === 'output-path') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'test']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('test');
                } else if (flag.name === 'output-pathinfo') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'verbose']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`pathinfo: 'verbose'`);
                } else if (flag.name === 'output-worker-chunk-loading') {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'async-node']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else if (flag.name.includes('wasm')) {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'async-node']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'test']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'test'`);
                }
            });
        }
    });

    it(`should config name, type and export  correctly`, () => {
        const { exitCode, stderr, stdout } = run(__dirname, [
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
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('myLibrary');
        expect(stdout).toContain(`type: 'var'`);
        expect(stdout).toContain('export: [Array]');
        expect(stdout).toContain(`auxiliaryComment: 'comment'`);
        expect(stdout).toContain('umdNamedDefine: true');
    });

    it('should be succesful with --output-library-reset correctly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-library-reset', '--output-library', 'newLibrary']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('newLibrary');
    });
});
