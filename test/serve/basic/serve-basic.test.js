'use strict';

const { yellow, options } = require('colorette');
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
        const { stdout } = await runServe(['--help', '--no-color'], __dirname);
        options.enabled = true;
        expect(stdout).not.toContain(yellow(usageText));
        expect(stdout).toContain(descriptionText);
    });

    it('should not invoke info subcommand', async () => {
        const { stdout } = await runServe(['--client-log-level', 'info'], testPath);
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('compiles without flags', async () => {
        const { stdout } = await runServe(['--port', port], testPath);
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('uses hot flag to alter bundle', async () => {
        const { stdout } = await runServe(['--port', port, '--hot'], testPath);
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
    });

    it('uses hot-only flag to alter bundle', async () => {
        const { stdout } = await runServe(['--port', port, isDevServer4 ? '--hot only' : '--hot-only'], testPath);
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
    });

    it('uses no-hot flag', async () => {
        const { stdout } = await runServe(['--port', port, '--no-hot'], testPath);
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
    });

    it('uses hot flag and progress flag', async () => {
        const { stdout, stderr } = await runServe(['--port', port, '--hot', '--progress'], testPath);
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('HotModuleReplacementPlugin');
        // progress flag makes use of stderr
        expect(stderr).not.toHaveLength(0);
    });

    it('throws error on unknown flag', async () => {
        const { stdout, stderr } = await runServe(['--port', port, '--unknown-flag'], testPath);
        expect(stdout).toHaveLength(0);
        expect(stderr).toContain('Unknown argument: --unknown-flag');
    });
});
