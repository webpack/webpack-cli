'use strict';

const { yellow, options } = require('colorette');
const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('single help flag', () => {
    it('respects --color flag as false', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--color=false'], false);
        const usage = 'webpack [...options] | <command>';
        const example = 'webpack help --flag | <command>';
        options.enabled = true;

        expect(stdout).not.toContain(yellow(usage));
        expect(stdout).not.toContain(yellow(example));
        expect(stdout).toContain(usage);
        expect(stdout).toContain(example);
        expect(stderr).toHaveLength(0);
    });

    it('outputs help info with command syntax', () => {
        const { stdout, stderr } = run(__dirname, ['help'], false);
        expect(stdout).toContain(helpHeader);
        expect(stderr).toHaveLength(0);
    });

    it('outputs help info with dashed syntax', () => {
        const { stdout, stderr } = run(__dirname, ['--help'], false);
        expect(stdout).toContain(helpHeader);
        expect(stderr).toHaveLength(0);
    });

    it('creates a readable snapshot', () => {
        const { stderr } = run(__dirname, ['--help'], false);

        const serializer = require('jest-serializer-ansi');
        expect.addSnapshotSerializer(serializer);

        expect(stderr).toHaveLength(0);
    });
});
