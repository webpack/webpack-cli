'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const snapshotFlags = flagsFromCore.filter(({ name }) => name.startsWith('snapshot'));

describe('snapshot config related flags', () => {
    snapshotFlags.forEach((flag) => {
        // extract property name from flag name
        let property = flag.name.split('snapshot-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [`--${flag.name}`]);

                expect(exitCode).toBe(0);
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

        if (flag.type === String) {
            it(`should config --${flag.name} correctly`, () => {
                const { stdout, exitCode } = run(__dirname, [`--${flag.name}`, 'test-snap-path']);

                expect(exitCode).toBe(0);
                expect(stdout).toContain('test-snap-path');
            });
        }
    });
});
