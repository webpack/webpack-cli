'use strict';

const { run } = require('../utils/test-utils');

describe('node option related flags', () => {
    it('should config node option', () => {
        const { stderr, stdout } = run(__dirname, ['--node']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`node: { global: true, __filename: 'mock', __dirname: 'mock' }`);
    });

    it('should config node option to false', () => {
        const { stderr, stdout } = run(__dirname, ['--no-node']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('node: false');
    });

    it('should set node.global equals to true', () => {
        const { stderr, stdout } = run(__dirname, ['--node']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('global: true');
    });

    it('should set node.filename correctly', () => {
        const { stderr, stdout } = run(__dirname, ['--node-filename', 'mock']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`__filename: 'mock'`);
    });

    it('should set node.filename correctly', () => {
        const { stderr, stdout } = run(__dirname, ['--node-dirname', 'mock']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`__dirname: 'mock'`);
    });
});
