'use strict';

const { runAsync, hyphenToUpperCase } = require('../../utils/test-utils');
const CLI = require('../../../packages/webpack-cli/lib/index');

const cli = new CLI();
const resolveFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('resolve'));

describe('resolve config related flags', () => {
    resolveFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('resolve-')[1];

        if (flag.name.startsWith('resolve-loader')) {
            property = flag.name.split('resolve-loader-')[1];
        }

        const propName = hyphenToUpperCase(property);

        if (
            flag.configs.filter((config) => config.type === 'boolean').length > 0 &&
            !flag.name.includes('alias-') &&
            !flag.name.includes('fallback-')
        ) {
            it(`should config --${flag.name} correctly`, async () => {
                const { stderr, stdout } = await runAsync(__dirname, [`--${flag.name}`]);

                // expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });
        }

        if (
            flag.configs.filter((config) => config.type === 'string').length > 0 &&
            !flag.name.includes('alias-') &&
            !flag.name.includes('fallback-')
        ) {
            it(`should config --${flag.name} correctly`, async () => {
                const { stderr, stdout } = await runAsync(__dirname, [`--${flag.name}`, 'browser']);

                // expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (propName === 'restrictions') {
                    expect(stdout).toContain('browser');
                } else {
                    expect(stdout).toContain(`${propName}: [ 'browser' ]`);
                }
            });
        }

        if (flag.name.includes('alias-') || flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await runAsync(__dirname, [
                    `--resolve-alias-alias`,
                    'alias',
                    '--resolve-alias-name',
                    'name',
                    '--resolve-alias-fields',
                    'aliasField',
                    '--resolve-loader-alias-alias',
                    'loaderAlias',
                    '--resolve-loader-alias-name',
                    'loaderName',
                    '--resolve-loader-alias-fields',
                    'loader-field',
                    '--resolve-fallback-alias',
                    'fall-alias',
                    '--resolve-fallback-name',
                    'fall-name',
                    '--resolve-loader-fallback-alias',
                    'loader-fall-alias',
                    '--resolve-loader-fallback-name',
                    'loader-fall-name',
                ]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`alias: [ { alias: 'alias', name: 'name' } ]`);
                expect(stdout).toContain(`aliasFields: [ 'aliasField' ]`);
                expect(stdout).toContain(`alias: [ { alias: 'loaderAlias', name: 'loaderName' } ]`);
                expect(stdout).toContain(`aliasFields: [ 'loader-field' ]`);
                expect(stdout).toContain('fall-name');
                expect(stdout).toContain('fall-alias');
                expect(stdout).toContain('loader-fall-name');
                expect(stdout).toContain('loader-fall-alias');
            });

            if (flag.name.includes('reset')) {
                it(`should config --${flag.name} alias-reset flags correctly`, async () => {
                    const { exitCode, stderr, stdout } = await runAsync(__dirname, [
                        '--resolve-alias-reset',
                        '--resolve-fallback-reset',
                        '--resolve-alias-fields-reset',
                        '--resolve-loader-alias-reset',
                        '--resolve-loader-alias-fields-reset',
                        '--resolve-loader-fallback-reset',
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`alias: []`);
                    expect(stdout).toContain(`aliasFields: []`);
                    expect(stdout).toContain(`fallback: []`);
                });
            }
        }
    });
});
