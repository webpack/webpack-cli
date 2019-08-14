'use strict';

const { run } = require('../../../testUtils');
const serializer = require('jest-serializer-ansi');

test('mixed', () => {
    const { stdout, stderr } = run(__dirname, ['--version', '--target', 'browser']);
    expect.addSnapshotSerializer(serializer);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toHaveLength(0);
});
