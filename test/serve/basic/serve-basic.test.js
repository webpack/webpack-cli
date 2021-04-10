'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const getPort = require('get-port');
const { runWatch, isWebpack5, isDevServer4 } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

describe('basic serve usage', () => {
    let port;

    beforeEach(async () => {
        port = await getPort();
    });

    it('should work', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--config" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'serve.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--config" and "--env" options', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            'serve',
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
        const { stderr, stdout } = await runWatch(__dirname, [
            'serve',
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
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'multi.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    // TODO need fix in future, edge case
    it.skip('should work in multi compiler mode with multiple dev servers', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'multi-dev-server.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--mode" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--stats" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--stats']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(isWebpack5 ? 'compiled successfully' : 'Version: webpack');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--stats verbose" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--stats', 'verbose']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(isWebpack5 ? 'from webpack.Compiler' : 'webpack.buildChunkGraph.visitModules');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--mode" option #2', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--mode', 'production']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('production');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--mode" option #3', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--mode', 'development']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--progress" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--progress']);

        expect(stderr).toContain('webpack.Progress');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--progress" option using the "profile" value', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--progress', 'profile']);

        expect(stderr).toContain('webpack.Progress');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--client-log-level" option', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--client-log-level', 'info']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--port" option', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--hot" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--hot']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with the "--no-hot" option', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--no-hot']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--hot" option using the "only" value', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, isDevServer4 ? '--hot only' : '--hot-only']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with "--hot" and "--port" options', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--hot']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with the "--hot" and "--progress" options', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--hot', '--progress']);

        expect(stderr).toContain('webpack.Progress');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toHaveLength(1);
    });

    it('should work with the default "publicPath" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('from /');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--output-public-path" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--output-public-path', '/my-public-path/']);

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
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'output-public-path.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('/my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should respect the "publicPath" option from configuration using multi compiler mode', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'multi-output-public-path.config.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('one');
        expect(stdout).toContain('first-output/main.js');
        expect(stdout).toContain('two');
        expect(stdout).toContain('second-output/main.js');
        expect(stdout).toContain('/my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should respect the "publicPath" option from configuration (from the "devServer" options)', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'dev-server-output-public-path.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('/dev-server-my-public-path/');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work with the "--open" option', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--open', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should respect the "publicPath" option from configuration using multi compiler mode (from the "devServer" options)', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            'serve',
            '--config',
            'multi-dev-server-output-public-path.config.js',
            '--port',
            port,
        ]);

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
        const { stderr, stdout } = await runWatch(__dirname, ['serve', './src/entry.js', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should work and log warning on the `watch option in a configuration', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', './watch.config.js', '--port', port]);

        expect(stderr).toContain(
            "No need to use the 'serve' command together with '{ watch: true }' configuration, it does not make sense.",
        );
        expect(stdout).toContain('development');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should log used supplied config with serve', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'log.config.js', '--port', port]);
        const configPath = path.resolve(__dirname, './log.config.js');

        expect(stderr).toContain('Compiler starting...');
        expect(stderr).toContain(`Compiler is using config: '${configPath}'`);
        expect(stderr).toContain('Compiler finished');
        expect(stdout).toBeTruthy();
    });

    it("should log error on using '--watch' flag with serve", async () => {
        const { exitCode, stdout, stderr } = await runWatch(testPath, ['serve', '--watch']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--watch'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it("should log error on using '-w' alias with serve", async () => {
        const { exitCode, stdout, stderr } = await runWatch(testPath, ['serve', '-w']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '-w'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error on unknown flag', async () => {
        const { exitCode, stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--unknown-flag']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown-flag'");
        expect(stdout).toBeFalsy();
    });

    it('should work with the "stats" option in config', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'stats.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Compiled successfully');
        expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
    });

    it('should throw error when same ports in multicompiler', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['serve', '--config', 'same-ports-dev-serever.config.js']);

        expect(stdout).toBeFalsy();
        expect(stderr).toContain('Unique ports must be specified for each devServer option in your webpack configuration');
    });
});
