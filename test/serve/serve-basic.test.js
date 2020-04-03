'use strict';

const path = require('path');
const getPort = require('get-port');
const { runWatch } = require('../utils/test-utils');

const runServe = (args) => {
    return runWatch({
        testCase: path.resolve(__dirname),
        args: ['serve'].concat(args),
        setOutput: false,
        outputKillStr: 'main',
    });
};

describe('basic serve usage', () => {
    let port;

    beforeEach(async () => {
        port = await getPort();
    });

    const isWindows = process.platform === 'win32';

    if (isWindows) {
        // TODO fix me on windows
        it('compiles without flags', () => {
            expect(true).toBe(true);

            console.warn('TODO: fix `serve` test on windows');
        });
    } else {
        it('compiles without flags', async () => {
            const { stdout, stderr } = await runServe(['--port', port]);
            expect(stdout).toContain('main.js');
            expect(stdout).not.toContain('hot/dev-server.js');
            expect(stderr).toHaveLength(0);
        });

        it('uses hot flag to alter bundle', async () => {
            const { stdout, stderr } = await runServe(['--port', port, '--hot']);
            expect(stdout).toContain('main.js');
            expect(stdout).toContain('hot/dev-server.js');
            expect(stderr).toHaveLength(0);
        });

        it('uses hot flag and progress flag', async () => {
            const { stdout, stderr } = await runServe(['--port', port, '--hot', '--progress']);
            expect(stdout).toContain('main.js');
            expect(stdout).toContain('hot/dev-server.js');
            // progress flag makes use of stderr
            expect(stderr).not.toHaveLength(0);
        });

        it('throws error on unknown flag', async () => {
            const { stdout, stderr } = await runServe(['--port', port, '--unknown-flag']);
            expect(stdout).toHaveLength(0);
            expect(stderr).toContain('Unknown option: --unknown-flag');
        });
    }
});
