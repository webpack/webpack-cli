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

        if (flag.type === Boolean && !flag.name.includes('alias-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                expect(stderr).toBeFalsy();
                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });
        }

        if (flag.type === String && !flag.name.includes('alias-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'browser']);
                expect(stderr).toBeFalsy();
                if (propName === 'restrictions') {
                    expect(stdout).toContain('browser');
                } else {
                    expect(stdout).toContain(`${propName}: [ 'browser' ]`);
                }
            });
        }

        if (flag.name.includes('alias-')) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [
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
                ]);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`alias: [ { alias: 'alias', name: 'name' } ]`);
                expect(stdout).toContain(`aliasFields: [ 'aliasField' ]`);
                expect(stdout).toContain(`alias: [ { alias: 'loaderAlias', name: 'loaderName' } ]`);
                expect(stdout).toContain(`aliasFields: [ 'loader-field' ]`);
            });

            if (flag.name.includes('reset')) {
                it(`should config --${flag.name} alias-reset flags correctly`, () => {
                    const { stderr, stdout } = run(__dirname, [
                        `--resolve-alias-reset`,
                        '--resolve-alias-fields-reset',
                        '--resolve-loader-alias-reset',
                        '--resolve-loader-alias-fields-reset',
                    ]);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`alias: []`);
                    expect(stdout).toContain(`aliasFields: []`);
                });
            }
        }
    });
});
