'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const resolveFlags = flagsFromCore.filter(({ name }) => name.startsWith('resolve'));

describe('resolve config related flags', () => {
    resolveFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('resolve-')[1];
        if (flag.name.startsWith('resolve-loader')) {
            property = flag.name.split('resolve-loader-')[1];
        }
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean && !flag.name.includes('alias-') && !flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout } = run(__dirname, [`--${flag.name}`]);

                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });
        }

        if (flag.type === String && !flag.name.includes('alias-') && !flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'browser']);

                if (propName === 'restrictions') {
                    expect(stdout).toContain('browser');
                } else {
                    expect(stdout).toContain(`${propName}: [ 'browser' ]`);
                    expect(exitCode).toBe(0);
                }
            });
        }

        if (flag.name.includes('alias-') || flag.name.includes('fallback-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [
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
                it(`should config --${flag.name} alias-reset flags correctly`, () => {
                    const { stdout, exitCode } = run(__dirname, [
                        '--resolve-alias-reset',
                        '--resolve-fallback-reset',
                        '--resolve-alias-fields-reset',
                        '--resolve-loader-alias-reset',
                        '--resolve-loader-alias-fields-reset',
                        '--resolve-loader-fallback-reset',
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stdout).toContain(`alias: []`);
                    expect(stdout).toContain(`aliasFields: []`);
                    expect(stdout).toContain(`fallback: []`);
                });
            }
        }
    });
});
