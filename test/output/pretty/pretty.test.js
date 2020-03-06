const { run } = require('../../utils/test-utils');

describe('pretty output', () => {
    it('should output file given as flag instead of in configuration', () => {
        const { stdout } = run(__dirname, ['--pretty']);
        expect(stdout).toBeTruthy();
        expect(stdout).toContain('Entrypoint');
        expect(stdout).toContain('Bundle');
        expect(stdout).toContain('Built');
        expect(stdout).toContain('Version');
    });
});
