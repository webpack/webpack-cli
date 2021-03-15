'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const CLI = require('../../packages/webpack-cli/lib/index');

const cli = new CLI();
const moduleFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('module-'));

describe('module config related flag', () => {
    moduleFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('module-')[1];

        if (property.includes('rules-') && property !== 'rules-reset') {
            property = flag.name.split('rules-')[1];
        }

        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean && !flag.name.includes('module-no-parse') && !flag.name.includes('module-parser-')) {
            it(`should config --${flag.name} correctly`, () => {
                if (flag.name.includes('-reset')) {
                    const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);
                    const option = propName.split('Reset')[0];

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${option}: []`);
                } else if (flag.name.includes('rules-')) {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain("sideEffects: 'flag'");
                } else if (flag.name.startsWith('module-generator-')) {
                    const { exitCode, stderr, stdout } = run(__dirname, [
                        `--module-generator-asset-emit`,
                        '--module-generator-asset-resource-emit',
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain("generator: { asset: { emit: true }, 'asset/resource': { emit: true } }");
                } else {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, () => {
                    const { exitCode, stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();

                    if (flag.name.includes('rules-')) {
                        expect(stdout).toContain('sideEffects: false');
                    } else if (flag.name.startsWith('module-generator-')) {
                        expect(stdout).toContain('emit: false');
                    } else {
                        expect(stdout).toContain(`${propName}: false`);
                    }
                });
            }
        }

        if (flag.type === String && !(flag.name.includes('module-parser-') || flag.name.startsWith('module-generator'))) {
            it(`should config --${flag.name} correctly`, () => {
                if (flag.name === 'module-no-parse') {
                    let { stderr, stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'value']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain('value');
                } else if (flag.name.includes('reg-exp')) {
                    let { stdout, stderr, exitCode } = run(__dirname, [`--${flag.name}`, '/ab?c*/']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: /ab?c*/`);
                } else if (flag.name.includes('module-rules-')) {
                    if (propName === 'use' || propName === 'type') {
                        let { stdout } = run(__dirname, [`--${flag.name}`, 'javascript/auto']);

                        expect(stdout).toContain(`${propName}: 'javascript/auto'`);
                    } else if (property.includes('use-')) {
                        let stdout = run(__dirname, ['--module-rules-use-loader', 'myLoader']).stdout;
                        expect(stdout).toContain(`use: [Object]`);
                    } else if (propName === 'enforce') {
                        let stdout = run(__dirname, [`--${flag.name}`, 'pre', '--module-rules-use-loader', 'myLoader']).stdout;
                        expect(stdout).toContain(`${propName}: 'pre'`);
                    } else {
                        let stdout = run(__dirname, [`--${flag.name}`, '/rules-value']).stdout;
                        expect(stdout).toContain('rules-value');
                    }
                } else {
                    let { stderr, stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'value']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'value'`);
                }
            });
        }
    });

    it('should config module.generator flags coorectly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [
            '--module-generator-asset-data-url-encoding',
            'base64',
            '--module-generator-asset-data-url-mimetype',
            'application/node',
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`generator: { asset: { dataUrl: [Object] } }`);
    });

    it('should config module.parser flags coorectly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [
            '--module-parser-javascript-browserify',
            '--module-parser-javascript-commonjs',
            '--module-parser-javascript-harmony',
            '--module-parser-javascript-import',
            '--no-module-parser-javascript-node',
            '--module-parser-javascript-require-include',
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('browserify: true');
        expect(stdout).toContain('commonjs: true');
        expect(stdout).toContain('harmony: true');
        expect(stdout).toContain('import: true');
        expect(stdout).toContain('node: false');
    });
});
