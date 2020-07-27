'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const experimentsFlags = flagsFromCore.filter(({ name }) => name.startsWith('experiments-'));

describe('experiments option related flag', () => {
    experimentsFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('experiments-')[1];
        const propName = hyphenToUpperCase(property);

        it(`should config ${flag.name} correctly`, () => {
            const { stderr, stdout } = run(__dirname, [`--${flag.name}`]);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`${propName}: true`);
        });

        it(`should config --no-${flag.name} correctly`, () => {
            const { stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`${propName}: false`);
        });
    });
});
