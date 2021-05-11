'use strict';

const { run, hyphenToUpperCase, getWebpackCliArguments } = require('../../utils/test-utils');
const outputFlags = getWebpackCliArguments('output-');

describe('output config related flag', () => {
    for (const [name, value] of Object.entries(outputFlags)) {
        // extract property name from flag name
        let property = name.split('output-')[1];

        if (property.includes('environment-')) {
            property = property.split('environment-')[1];
        } else if (property.includes('clean-')) {
            property = property.split('clean-')[1];
        }

        const propName = hyphenToUpperCase(property);

        if (value.configs.filter((config) => config.type === 'boolean').length > 0 && !name.includes('output-library')) {
            it(`should config --${name} correctly`, async () => {
                let { stderr, stdout, exitCode } = await run(__dirname, [`--${name}`]);

                if (name === 'output-module') {
                    //'output.module: true' is only allowed when 'experiments.outputModule' is enabled
                    ({ exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, '--experiments-output-module']));

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('module: true');
                } else if (name === 'output-strict-module-error-handling') {
                    ({ exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, '--hot']));

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                } else if (name.includes('-reset')) {
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

            if (!name.endsWith('-reset') && !name.includes('output-strict-module-error-handling')) {
                it(`should config --no-${name} correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: false`);
                });
            }
        }

        if (value.configs.filter((config) => config.type === 'number').length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (value.configs.filter((config) => config.type === 'string').length > 0 && !name.includes('output-library')) {
            it(`should config --${name} correctly`, async () => {
                if (name === 'output-cross-origin-loading') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'anonymous']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'anonymous'`);
                } else if (name === 'output-chunk-format') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'commonjs']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'commonjs'`);
                } else if (name === 'output-chunk-loading') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'jsonp']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'jsonp'`);
                } else if (name === 'output-enabled-chunk-loading-types' || name === 'output-enabled-wasm-loading-types') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'async-node']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'async-node' ]`);
                } else if (name === 'output-enabled-library-type') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'amd']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'amd'`);
                } else if (name === 'output-hash-function') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'sha256']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`hashFunction: 'sha256'`);
                } else if (name === 'output-script-type') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'module']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'module'`);
                } else if (name === 'output-enabled-library-types') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'var']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'var' ]`);
                } else if (name === 'output-path') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'test']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('test');
                } else if (name === 'output-pathinfo') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'verbose']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`pathinfo: 'verbose'`);
                } else if (name === 'output-worker-chunk-loading') {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'async-node']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else if (name.includes('wasm')) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'async-node']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'async-node'`);
                } else if (name.includes('trusted-types')) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'test']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`trustedTypes: { policyName: 'test' }`);
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, 'test']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'test'`);
                }
            });
        }
    }

    it(`should config name, type and export  correctly`, async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
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

    it('should be succesful with --output-library-reset correctly', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--output-library-reset', '--output-library', 'newLibrary']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('newLibrary');
    });
});
