'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('single help flag', () => {
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
