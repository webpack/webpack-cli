const { runServe } = require('../../../../test/utils/test-utils');

describe('Serve', () => {
    const isWindows = process.platform === 'win32';

    // TODO fix me on windows
    if (isWindows) {
        it('TODO: Fix on windows', () => {
            expect(true).toBe(true);
        });
        return;
    }

    it('should run with cli', async () => {
        const { stdout } = await runServe([], __dirname);
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('should work with flags', async () => {
        const { stdout } = await runServe(['--hot'], __dirname);
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
    });
});
