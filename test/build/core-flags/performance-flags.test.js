'use strict';

const { run, hyphenToUpperCase, getWebpackCliArguments } = require('../../utils/test-utils');
const performanceFlags = getWebpackCliArguments().filter(({ name }) => name.startsWith('performance-'));

describe('module config related flag', () => {
    it(`should config --performance option correctly`, async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [`--no-performance`]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('performance: false');
    });

    performanceFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('performance-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.configs.filter((config) => config.type === 'number').length > 0) {
            it(`should config --${flag.name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.configs.filter((config) => config.type === 'string').length > 0) {
            it(`should config --${flag.name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${flag.name}`, 'warning']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 'warning'`);
            });
        }
    });
});
