'use strict';

const { run } = require('../../../testUtils');
const serializer = require('jest-serializer-ansi');

test('help-no-args', () => {
    const { stdout, stderr } = run(__dirname, ['--help']);
    expect.addSnapshotSerializer(serializer);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toHaveLength(0);
});
