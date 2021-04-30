'use strict';

const { run, hyphenToUpperCase, getWebpackCliArguments } = require('../../utils/test-utils');
const resolveFlags = getWebpackCliArguments('resolve');

describe('resolve config related flags', () => {
    for (const [name, value] of Object.entries(resolveFlags)) {
        // extract property name from flag name
        let property = name.split('resolve-')[1];

        if (name.startsWith('resolve-loader')) {
            property = name.split('resolve-loader-')[1];
        }

        const propName = hyphenToUpperCase(property);

        if (
            value.configs.filter((config) => config.type === 'boolean').length > 0 &&
            !name.includes('alias-') &&
            !name.includes('fallback-')
        ) {
            it(`should config --${name} correctly`, async () => {
                const { stderr, stdout } = await run(__dirname, [`--${name}`]);

                // expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });
        }

        if (
            value.configs.filter((config) => config.type === 'string').length > 0 &&
            !name.includes('alias-') &&
            !name.includes('fallback-')
        ) {
            it(`should config --${name} correctly`, async () => {
                const { stderr, stdout } = await run(__dirname, [`--${name}`, 'browser']);

                // expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (propName === 'restrictions') {
                    expect(stdout).toContain('browser');
                } else {
                    expect(stdout).toContain(`${propName}: [ 'browser' ]`);
                }
            });
        }

        if (name.includes('alias-') || name.includes('fallback-')) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [
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

            if (name.includes('reset')) {
                it(`should config --${name} alias-reset flags correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
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
    }
});
