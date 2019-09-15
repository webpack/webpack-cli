'use strict';

const chalk = require('chalk');
const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('single help flag', () => {
    it('respects --color flag as false', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--color=false']);
        const usage = 'webpack [...options] | <command>';
        const example = 'webpack help --flag | <command>';
        const orange = chalk.keyword('orange');
        expect(stdout).not.toContain(orange(usage));
        expect(stdout).not.toContain(orange(example));
        expect(stdout).toContain(usage);
        expect(stdout).toContain(example);
        expect(stderr).toHaveLength(0);
    });
    it('outputs help info with command syntax', () => {
        const { stdout, stderr } = run(__dirname, ['help']);
        expect(stdout).toContain(helpHeader);
        expect(stderr).toHaveLength(0);
    });

    it('outputs help info with dashed syntax', () => {
        const { stdout, stderr } = run(__dirname, ['--help']);
        expect(stdout).toContain(helpHeader);
        expect(stderr).toHaveLength(0);
    });

    it('creates a readable snapshot', () => {
        const { stdout, stderr } = run(__dirname, ['--help']);

        const serializer = require('jest-serializer-ansi');
        expect.addSnapshotSerializer(serializer);

        expect(stdout).toMatchSnapshot();
        expect(stderr).toHaveLength(0);
    });
});
