'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const getPort = require('get-port');
const { runWatch, normalizeStderr, isDevServer4 } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

describe('serve with devServer in config', () => {
    let port;

    beforeEach(async () => {
        port = await getPort();
    });

    it('Should pick up the host and port from config', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve']);

        if (isDevServer4) {
            expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            // Runs at correct host and port
            expect(stderr).toContain('http://localhost:1234');
        } else {
            expect(normalizeStderr(stderr)).toMatchSnapshot();
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            expect(stdout).not.toContain('HotModuleReplacementPlugin');
            // Runs at correct host and port
            expect(stdout).toContain('http://localhost:1234');
        }
    });

    it('Port flag should override the config port', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port]);

        if (isDevServer4) {
            expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            // Runs at correct host and port
            expect(stderr).toContain(`http://localhost:${port}`);
        } else {
            expect(stderr).toMatchSnapshot();
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            expect(stdout).not.toContain('HotModuleReplacementPlugin');
            // Runs at correct host and port
            expect(stdout).toContain(`http://localhost:${port}`);
        }
    });

    it('Passing hot flag works alongside other server config', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--hot']);

        if (isDevServer4) {
            expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
            // Should output the correct bundle file
            expect(stdout).toContain('main.js');
            // HMR is being used
            expect(stdout).toContain('webpack/hot/dev-server.js');
        } else {
            expect(stderr).toBeFalsy();
            // Runs at correct host and port
            expect(stdout).toContain(`http://localhost:${port}`);
        }

        // Should output the correct bundle file
        expect(stdout).toContain('main.js');
        // HMR is being used
        expect(stdout).toContain('webpack/hot/dev-server.js');
    });

    it('works fine when no-hot flag is passed alongside other server config', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--no-hot']);

        expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
        // Should output the correct bundle file
        expect(stdout).toContain('main.js');
        
        if (isDevServer4) {
            // HMR is not being used
            expect(stdout).not.toContain('webpack/hot/dev-server.js');
        } else {
            // HMR is not being used
            expect(stdout).not.toContain('HotModuleReplacementPlugin');
            // Runs at correct host and port
            expect(stdout).toContain(`http://localhost:${port}`);
        }
    });
});
