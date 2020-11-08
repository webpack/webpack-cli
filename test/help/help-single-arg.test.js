'use strict';

const { yellow, options } = require('colorette');
const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('single help flag', () => {
    it('respects --no-color flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--no-color'], false);
        const usage = 'webpack [...options] | <command>';
        const example = 'webpack help --flag | <command>';
        options.enabled = true;

        expect(exitCode).toBe(0);
        expect(stderr).not.toContain(yellow(usage));
        expect(stderr).not.toContain(yellow(example));
        expect(stdout).toContain(usage);
        expect(stdout).toContain(example);
    });

    it('outputs help info with command syntax', () => {
        const { stdout, exitCode } = run(__dirname, ['help'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(helpHeader);
    });

    it('outputs help info with dashed syntax', () => {
        const { stdout, exitCode } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(helpHeader);
    });

    it('creates a readable snapshot', () => {
        run(__dirname, ['--help'], false);

        const serializer = require('jest-serializer-ansi');
        expect.addSnapshotSerializer(serializer);
    });
});
