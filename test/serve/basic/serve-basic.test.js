'use strict';

const path = require('path');
const getPort = require('get-port');
const { runServe, isDevServer4 } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

const usageText = 'webpack s | serve';
const descriptionText = 'Run the webpack Dev Server';

describe('basic serve usage', () => {
    let port;

    beforeEach(async () => {
        port = await getPort();
    });

    const isWindows = process.platform === 'win32';

    // TODO fix me on windows
    if (isWindows) {
        it('TODO: Fix on windows', () => {
            expect(true).toBe(true);
        });
        return;
    }

    it('should respect the --no-color flag', async () => {
        const { stdout, stderr } = await runServe(['--help', '--no-color'], __dirname);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
    });

    it('should not invoke info subcommand', async () => {
        const { stdout, stderr } = await runServe(['--client-log-level', 'info'], testPath);

        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compilation starting...');
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('compiles without flags', async () => {
        const { stdout, stderr } = await runServe(['--port', port], testPath);

        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compilation starting...');
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('uses hot flag to alter bundle', async () => {
        const { stdout, stderr } = await runServe(['--port', port, '--hot'], testPath);

        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compilation starting...');
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
    });

    it('uses hot-only flag to alter bundle', async () => {
        const { stdout, stderr } = await runServe(['--port', port, isDevServer4 ? '--hot only' : '--hot-only'], testPath);

        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compilation starting...');
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
    });

    it('uses no-hot flag', async () => {
        const { stdout, stderr } = await runServe(['--port', port, '--no-hot'], testPath);

        expect(stdout).toContain('main.js');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compilation starting...');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('uses hot flag and progress flag', async () => {
        const { stdout, stderr } = await runServe(['--port', port, '--hot', '--progress'], testPath);

        expect(stderr).toContain('webpack.Progress');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compilation starting...');
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
    });

    it('throws error on unknown flag', async () => {
        const { exitCode, stdout, stderr } = await runServe(['--port', port, '--unknown-flag'], testPath);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Unknown argument: --unknown-flag');
        expect(stdout).toBeFalsy();
    });
});
