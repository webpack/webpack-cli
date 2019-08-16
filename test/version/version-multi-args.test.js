'use strict';

const { run } = require('../utils/test-utils');
const pkgLock = require('../../package.json');

describe('version flag with multiple arguments', () => {
    it('outputs version with mixed syntax', () => {
        const { stdout, stderr } = run(__dirname, ['--version', '--target', 'browser']);
        expect(stdout).toContain(pkgLock.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with multiple commands', () => {
        const { stdout, stderr } = run(__dirname, ['version', 'init']);
        expect(stdout).toContain(pkgLock.version);
        expect(stderr).toHaveLength(0);
    });

    it('does not output version with help command', () => {
        const { stdout, stderr } = run(__dirname, ['version', 'help']);
        expect(stdout).not.toContain(pkgLock.version);

        const uniqueIdentifier = 'Made with ♥️  by the webpack team';
        expect(stdout).toContain(uniqueIdentifier);
        expect(stderr).toHaveLength(0);
    });

    it('does not output version with help dashed', () => {
        const { stdout, stderr } = run(__dirname, ['version', '--help']);
        expect(stdout).not.toContain(pkgLock.version);

        const uniqueIdentifier = 'Made with ♥️  by the webpack team';
        expect(stdout).toContain(uniqueIdentifier);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with multiple dashed args and has precidence', () => {
        const { stdout, stderr } = run(__dirname, ['--target', 'browser', '--version']);
        expect(stdout).toContain(pkgLock.version);
        expect(stderr).toHaveLength(0);
    });
});
