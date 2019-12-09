'use strict';

const { run } = require('../utils/test-utils');
const outputDescription = 'Output location of the file generated by webpack·';
const createDescription = 'Initialize a new webpack configuration·';
describe('help flag with multiple arguments', () => {
    it('outputs info with dashed syntax', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--target', 'browser']);
        expect(stdout).toContain(outputDescription);
        expect(stderr).toHaveLength(0);
    });

    it('outputs info with multiple arguments using dashes and with precedence', () => {
        const { stdout, stderr } = run(__dirname, ['--target', 'browser', '--help']);
        expect(stdout).toContain(outputDescription);
        expect(stderr).toHaveLength(0);
    });

    it('outputs info with multiple commands and with precedence', () => {
        const { stdout, stderr } = run(__dirname, ['create', 'help']);
        expect(stdout).toContain(createDescription);
        expect(stderr).toHaveLength(0);
    });
});
