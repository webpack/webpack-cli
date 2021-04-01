'use strict';

const { run } = require('../../utils/test-utils');

describe('node option related flags', () => {
    it('should config node option to false', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--no-node']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('node: false');
    });

    it('should set node.filename correctly', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--node-filename', 'mock']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`__filename: 'mock'`);
    });

    it('should set node.filename correctly', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--node-dirname', 'mock']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`__dirname: 'mock'`);
    });
});
