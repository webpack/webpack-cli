'use strict';

const { run } = require('../utils/test-utils');

describe('node option related flags', () => {
    it('should config node option', () => {
        const { stdout, exitCode } = run(__dirname, ['--node']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`node: { global: true, __filename: 'mock', __dirname: 'mock' }`);
    });

    it('should config node option to false', () => {
        const { stdout, exitCode } = run(__dirname, ['--no-node']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('node: false');
    });

    it('should set node.global equals to true', () => {
        const { stdout, exitCode } = run(__dirname, ['--node']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('global: true');
    });

    it('should set node.filename correctly', () => {
        const { stdout, exitCode } = run(__dirname, ['--node-filename', 'mock']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`__filename: 'mock'`);
    });

    it('should set node.filename correctly', () => {
        const { stdout, exitCode } = run(__dirname, ['--node-dirname', 'mock']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`__dirname: 'mock'`);
    });
});
