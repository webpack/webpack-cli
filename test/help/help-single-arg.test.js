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

    it('outputs help info with command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpHeader);
    });

    it('outputs help info with dashed syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpHeader);
    });

    it('creates a readable snapshot', () => {
        const { stderr } = run(__dirname, ['--help'], false);

        const serializer = require('jest-serializer-ansi');

        expect.addSnapshotSerializer(serializer);

        expect(stderr).toBeFalsy();
    });
});
