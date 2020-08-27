'use strict';
const { run } = require('../../utils/test-utils');

describe('mode flags', () => {
    it('should set mode=production by default', () => {
        const { stderr, stdout } = run(__dirname);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should load a development config when --mode=development is passed', () => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'development']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should load a production config when --mode=production is passed', () => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should load a none config when --mode=none is passed', () => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'none']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'none'`);
    });

    it('should throw error when --mode=abcd is passed', () => {
        const { stderr } = run(__dirname, ['--mode', 'abcd']);
        expect(stderr).toContain('configuration.mode should be one of these');
        expect(stderr).toContain(`"development" | "production" | "none"`);
    });
});
