'use strict';

const { run } = require('../utils/test-utils');
const { commands } = require('../../packages/webpack-cli/lib/utils/cli-flags');
const helpHeader = 'The build tool for modern web applications';

describe('help cmd with multiple arguments', () => {
    commands.forEach((cmd) => {
        it(`shows cmd help with ${cmd.name}`, () => {
            const { stdout, stderr, exitCode } = run(__dirname, ['--help', `${cmd.name}`], false);

            expect(exitCode).toBe(0);
            expect(stderr).not.toContain(helpHeader);
            expect(stdout).toContain(`${cmd.name}`);
            expect(stdout).toContain(`${cmd.usage}`);
            expect(stdout).toContain(`${cmd.description}`);
        });
    });

    it('should output help for --version by taking precedence', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).not.toContain(helpHeader);
        expect(stdout).toContain('webpack -v, --version');
    });
});
