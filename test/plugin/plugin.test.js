const { existsSync, mkdirSync } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const ENTER = '\x0D';

const firstPrompt = '? Plugin name';
const pluginName = 'test-plugin';

const pluginPath = join(__dirname, pluginName);
const defaultPluginPath = join(__dirname, 'my-webpack-plugin');
const genPath = join(__dirname, 'test-assets');
const customPluginPath = join(genPath, pluginName);

describe('plugin command', () => {
    beforeEach(() => {
        rimraf.sync(defaultPluginPath);
        rimraf.sync(pluginPath);
        rimraf.sync(genPath);
    });

    it('should ask the plugin name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['plugin'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold plugin with default name if no plugin name provided', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['plugin'], [`${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Check if the output directory exists with the appropriate plugin name
        expect(existsSync(defaultPluginPath)).toBeTruthy();

        // Skip test in case installation fails
        if (!existsSync(resolve(defaultPluginPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(join(defaultPluginPath, file))).toBeTruthy();
        });

        // Check if the the generated plugin works successfully
        stdout = run(__dirname, ['--config', './my-webpack-plugin/examples/simple/webpack.config.js'], false).stdout;
        expect(stdout).toContain('Hello World!');
    });

    it('should scaffold plugin template with a given name', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['plugin'], [`${pluginName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Check if the output directory exists with the appropriate plugin name
        expect(existsSync(pluginPath)).toBeTruthy();

        // Skip test in case installation fails
        if (!existsSync(resolve(pluginPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(join(pluginPath, file))).toBeTruthy();
        });

        // Check if the the generated plugin works successfully
        stdout = run(__dirname, ['--config', './test-plugin/examples/simple/webpack.config.js'], false).stdout;
        expect(stdout).toContain('Hello World!');
    });

    it('should scaffold plugin template in the specified path', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['plugin', 'test-assets'], [`${pluginName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Check if the output directory exists with the appropriate plugin name
        expect(existsSync(customPluginPath)).toBeTruthy();

        // Skip test in case installation fails
        if (!existsSync(resolve(customPluginPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(join(customPluginPath, file))).toBeTruthy();
        });

        // Check if the the generated plugin works successfully
        stdout = run(customPluginPath, ['--config', './examples/simple/webpack.config.js'], false).stdout;
        expect(stdout).toContain('Hello World!');
    });

    it('should scaffold plugin template in the current directory', async () => {
        // Create test-assets directory
        mkdirSync(genPath);

        let { stdout } = await runPromptWithAnswers(genPath, ['plugin', './'], [`${pluginName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Check if the output directory exists with the appropriate plugin name
        expect(existsSync(customPluginPath)).toBeTruthy();

        // Skip test in case installation fails
        if (!existsSync(resolve(customPluginPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(join(customPluginPath, file))).toBeTruthy();
        });

        // Check if the the generated plugin works successfully
        stdout = run(customPluginPath, ['--config', './examples/simple/webpack.config.js'], false).stdout;
        expect(stdout).toContain('Hello World!');
    });
});
