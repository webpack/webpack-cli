'use strict';

const { yellow, options } = require('colorette');
const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('single help flag', () => {
    it('respects --no-color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--no-color'], false);
        const usage = 'webpack [...options] | <command>';
        const example = 'webpack help --flag | <command>';
        options.enabled = true;

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(yellow(usage));
        expect(stdout).not.toContain(yellow(example));
        expect(stdout).toContain(usage);
        expect(stdout).toContain(example);
    });

    it('outputs basic help info with command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpHeader);
    });

    it('outputs basic help info with dashed syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpHeader);
        expect(stdout).toContain('--merge');
        expect(stdout).not.toContain('--config-name'); // verbose
    });

    it('outputs advanced help info with dashed syntax', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', 'verbose'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpHeader);
        expect(stdout).toContain('--config-name'); // verbose
        expect(stdout).toContain('--config'); // base
    });

    it('outputs advanced help info with command syntax', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['help', 'verbose'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpHeader);
        expect(stdout).toContain('--config-name'); // verbose
        expect(stdout).toContain('--config'); // base
    });

    it('outputs advanced help info with --help=verbose', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help=verbose'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(helpHeader);
        expect(stdout).toContain('--config-name'); // verbose
        expect(stdout).toContain('--config'); // base
        expect(stderr).toBeFalsy();
    });
});
