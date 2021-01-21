'use strict';

const stripAnsi = require('strip-ansi');
const path = require('path');
const getPort = require('get-port');
const { runServe, isWebpack5, isDevServer4 } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

const usageText = 'webpack serve|s [options]';
const descriptionText = 'Run the webpack dev server';

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

    it('should work', async () => {
        const { stderr, stdout } = await runServe(__dirname, []);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--config" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'serve.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--config" and "--env" options', async () => {
        const { stderr, stdout } = await runServe(__dirname, [
            '--config',
            'function-with-env.config.js',
            '--env',
            'foo=bar',
            '--port',
            port,
        ]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('WEBPACK_SERVE: true');
        expect(stdout).toContain("foo: 'bar'");
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--config" and "--env" options and expose dev server options', async () => {
        const { stderr, stdout } = await runServe(__dirname, [
            '--config',
            'function-with-argv.config.js',
            '--env',
            'foo=bar',
            '--hot',
            '--port',
            port,
        ]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('hot: true');
        expect(stdout).toContain('WEBPACK_SERVE: true');
        expect(stdout).toContain("foo: 'bar'");
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work in multi compiler mode', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'multi.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    // TODO need fix in future, edge case
    it.skip('should work in multi compiler mode with multiple dev servers', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'multi-dev-server.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--mode" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, []);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--stats" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--stats']);

        expect(stderr).toBeFalsy();
        expect(stripAnsi(stdout)).toContain(isWebpack5 ? 'compiled successfully' : 'Version: webpack');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--stats verbose" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--stats', 'verbose']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(isWebpack5 ? 'from webpack.Compiler' : 'webpack.buildChunkGraph.visitModules');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--mode" option #2', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--mode', 'production']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('production');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--mode" option #3', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--mode', 'development']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--progress" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--progress']);

        expect(stderr).toContain('webpack.Progress');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--progress" option using the "profile" value', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--progress', 'profile']);

        expect(stderr).toContain('webpack.Progress');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should log help information and respect the "--no-color" option', async () => {
        const { stdout, stderr } = await runServe(__dirname, ['--help', '--no-color']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
    });

    it('should work with the "--client-log-level" option', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--client-log-level', 'info']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--port" option', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--hot" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--hot']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with the "--no-hot" option', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--port', port, '--no-hot']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--hot" option using the "only" value', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--port', port, isDevServer4 ? '--hot only' : '--hot-only']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with "--hot" and "--port" options', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--port', port, '--hot']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with the "--hot" and "--progress" options', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--port', port, '--hot', '--progress']);

        expect(stderr).toContain('webpack.Progress');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with the default "publicPath" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, []);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stripAnsi(stdout)).toContain('from /');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--output-public-path" option', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--output-public-path', '/my-public-path/']);

        if (isWebpack5) {
            expect(stderr).toBeFalsy();
            expect(stdout).toContain('main.js');
            expect(stdout).toContain('/my-public-path/');
            expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
        } else {
            expect(stderr).toContain("Error: Unknown option '--output-public-path'");
            expect(stdout).toBeFalsy();
        }
    });

    it('should respect the "publicPath" option from configuration', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'output-public-path.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('/my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should respect the "publicPath" option from configuration using multi compiler mode', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'multi-output-public-path.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout).toContain('/my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should respect the "publicPath" option from configuration (from the "devServer" options)', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'dev-server-output-public-path.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('/dev-server-my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--open" option', async () => {
        const { stdout, stderr } = await runServe(testPath, ['--open', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should respect the "publicPath" option from configuration using multi compiler mode (from the "devServer" options)', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['--config', 'multi-dev-server-output-public-path.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout).toContain('/dev-server-my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with entries syntax', async () => {
        const { stderr, stdout } = await runServe(__dirname, ['./src/entry.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should log and error on unknown flag', async () => {
        const { exitCode, stdout, stderr } = await runServe(testPath, ['--port', port, '--unknown-flag']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown-flag'");
        expect(stdout).toBeFalsy();
    });
});
