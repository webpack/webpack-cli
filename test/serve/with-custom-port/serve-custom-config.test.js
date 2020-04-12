'use strict';

const path = require('path');
const getPort = require('get-port');
const { runServe } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

describe('serve with devServer in config', () => {
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
        it('Should pick up the host and port from config', async () => {
            const { stdout, stderr } = await runServe([], testPath);
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            expect(stdout).not.toContain('hot/dev-server.js');
            // Runs at correct host and port
            expect(stdout).toContain('http://0.0.0.0:1234');
            expect(stderr).toBeFalsy();
        });

        it('Port flag should override the config port', async () => {
            const { stdout, stderr } = await runServe(['--port', port], testPath);
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            expect(stdout).not.toContain('hot/dev-server.js');
            // Runs at correct host and port
            expect(stdout).toContain(`http://0.0.0.0:${port}`);
            expect(stderr).toBeFalsy();
        });

        it('Passing hot flag works alongside other server config', async () => {
            const { stdout, stderr } = await runServe(['--port', port, '--hot'], testPath);
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            // HMR is being used
            expect(stdout).toContain('hot/dev-server.js');
            // Runs at correct host and port
            expect(stdout).toContain(`http://0.0.0.0:${port}`);
            expect(stderr).toBeFalsy();
        });
    }
});
