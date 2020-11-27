'use strict';

const { run } = require('../utils/test-utils');

describe('node option related flags', () => {
    it('should config node option to false', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--no-node']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('node: false');
    });

    it('should set node.filename correctly', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--node-filename', 'mock']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(`__filename: 'mock'`);
    });

    it('should set node.filename correctly', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--node-dirname', 'mock']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(`__dirname: 'mock'`);
    });
});
