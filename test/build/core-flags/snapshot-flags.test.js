'use strict';

const { run, hyphenToUpperCase } = require('../../utils/test-utils');
const CLI = require('../../../packages/webpack-cli/lib/index');

const cli = new CLI();
const snapshotFlags = cli.getBuiltInOptions().filter(({ name }) => name.startsWith('snapshot'));

describe('snapshot config related flags', () => {
    snapshotFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('snapshot-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.configs.filter((config) => config.type === 'boolean').length > 0) {
            it(`should config --${flag.name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${flag.name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (flag.name.includes('reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stdout).toContain(`${option}: []`);
                } else if (flag.name.includes('timestamp')) {
                    expect(stdout).toContain(`timestamp: true`);
                } else if (flag.name.includes('hash')) {
                    expect(stdout).toContain(`hash: true`);
                }
            });
        }

        if (flag.configs.filter((config) => config.type === 'string').length > 0) {
            it(`should config --${flag.name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${flag.name}`, './mock/mock.js']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain('./mock/mock.js');
            });
        }
    });
});
