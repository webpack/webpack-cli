'use strict';

const { run, hyphenToUpperCase, normalizeStdout } = require('../../utils/test-utils');
const CLI = require('../../../packages/webpack-cli/lib/index');

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

        if (
            flag.configs.filter((config) => config.type === 'boolean').length > 0 &&
            !flag.name.includes('module-no-parse') &&
            !flag.name.includes('module-parser-')
        ) {
            it(`should config --${flag.name} correctly`, async () => {
                if (flag.name.includes('-reset')) {
                    const { stderr, stdout } = await run(__dirname, [`--${flag.name}`]);
                    const option = propName.split('Reset')[0];

                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${option}: []`);
                } else if (flag.name.includes('rules-')) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain("sideEffects: 'flag'");
                } else if (flag.name.startsWith('module-generator-')) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        `--module-generator-asset-emit`,
                        '--module-generator-asset-resource-emit',
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain("generator: { asset: { emit: true }, 'asset/resource': { emit: true } }");
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${propName}: true`);
                }
            });

            if (!flag.name.endsWith('-reset')) {
                it(`should config --no-${flag.name} correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${flag.name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();

                    if (flag.name.includes('rules-')) {
                        expect(normalizeStdout(stdout)).toContain('sideEffects: false');
                    } else if (flag.name.startsWith('module-generator-')) {
                        expect(normalizeStdout(stdout)).toContain('emit: false');
                    } else {
                        expect(normalizeStdout(stdout)).toContain(`${propName}: false`);
                    }
                });
            }
        }

        if (
            flag.configs.filter((config) => config.type === 'string').length > 0 &&
            !(flag.name.includes('module-parser-') || flag.name.startsWith('module-generator'))
        ) {
            it(`should config --${flag.name} correctly`, async () => {
                if (flag.name === 'module-no-parse') {
                    let { stderr, stdout, exitCode } = await run(__dirname, [`--${flag.name}`, 'value']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain('value');
                } else if (flag.name.includes('reg-exp')) {
                    let { stdout, stderr, exitCode } = await run(__dirname, [`--${flag.name}`, '/ab?c*/']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${propName}: /ab?c*/`);
                } else if (flag.name.includes('module-rules-')) {
                    if (propName === 'use' || propName === 'type') {
                        let { stdout } = await run(__dirname, [`--${flag.name}`, 'javascript/auto']);

                        expect(normalizeStdout(stdout)).toContain(`${propName}: 'javascript/auto'`);
                    } else if (property.includes('use-')) {
                        let { stdout } = await run(__dirname, ['--module-rules-use-loader', 'myLoader']);
                        expect(normalizeStdout(stdout)).toContain(`use: [Object]`);
                    } else if (propName === 'enforce') {
                        let { stdout } = await run(__dirname, [`--${flag.name}`, 'pre', '--module-rules-use-loader', 'myLoader']);
                        expect(normalizeStdout(stdout)).toContain(`${propName}: 'pre'`);
                    } else {
                        let { stdout } = await run(__dirname, [`--${flag.name}`, '/rules-value']);
                        expect(normalizeStdout(stdout)).toContain('rules-value');
                    }
                } else {
                    let { stderr, stdout, exitCode } = await run(__dirname, [`--${flag.name}`, 'value']);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${propName}: 'value'`);
                }
            });
        }
    });

    it('should config module.generator flags coorectly', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            '--module-generator-asset-data-url-encoding',
            'base64',
            '--module-generator-asset-data-url-mimetype',
            'application/node',
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain(`generator: { asset: { dataUrl: [Object] } }`);
    });

    it('should config module.parser flags correctly', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            '--module-parser-javascript-browserify',
            '--module-parser-javascript-commonjs',
            '--module-parser-javascript-harmony',
            '--module-parser-javascript-import',
            '--no-module-parser-javascript-node',
            '--module-parser-javascript-require-include',
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain('browserify: true');
        expect(normalizeStdout(stdout)).toContain('commonjs: true');
        expect(normalizeStdout(stdout)).toContain('harmony: true');
        expect(normalizeStdout(stdout)).toContain('import: true');
        expect(normalizeStdout(stdout)).toContain('node: false');
    });

    it('should accept --module-parser-javascript-url=relative', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--module-parser-javascript-url', 'relative']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain(`url: 'relative'`);
    });

    it('should throw an error for an invalid value of --module-parser-javascript-url', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--module-parser-javascript-url', 'test']);

        expect(exitCode).toBe(2);
        expect(normalizeStdout(stderr)).toContain(`Invalid value 'test' for the '--module-parser-javascript-url' option`);
        expect(normalizeStdout(stderr)).toContain(`Expected: 'relative'`);
        expect(stdout).toBeFalsy();
    });
});
