'use strict';

const { run } = require('../../../testUtils');
const serializer = require('jest-serializer-ansi');

test('precedence-command', () => {
    const { stdout, stderr } = run(__dirname, ['version', 'help']);
    expect.addSnapshotSerializer(serializer);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toHaveLength(0);
});
