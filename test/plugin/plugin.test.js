const { existsSync } = require('fs');
const { join, resolve } = require('path');
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');
// eslint-disable-next-line node/no-unpublished-require
const stripAnsi = require('strip-ansi');
const { run, runAsync, runPromptWithAnswers, mkdir, uniqueDirectoryForTest } = require('../utils/test-utils');

const ENTER = '\x0D';

const firstPrompt = '? Plugin name';
const rootAssetsPath = resolve(__dirname, './test-assets');
const dataForTests = (rootAssetsPath) => ({
    pluginName: 'test-plugin',
    pluginPath: join(rootAssetsPath, 'test-plugin'),
    defaultPluginPath: join(rootAssetsPath, 'my-webpack-plugin'),
    genPath: join(rootAssetsPath, 'test-assets'),
    customPluginPath: join(rootAssetsPath, 'test-assets', 'test-plugin'),
});

describe('plugin command', () => {
    beforeAll(async () => {
        await mkdir(rootAssetsPath);
    });

    afterAll(() => {
        rimraf.sync(rootAssetsPath);
    });

    it('should ask the plugin name when invoked', async () => {
        const { stdout, stderr } = await run(__dirname, ['plugin'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stripAnsi(stdout)).toContain(firstPrompt);
    });

    it('should scaffold plugin with default name if no plugin name provided', async () => {
        const assetsPath = await uniqueDirectoryForTest(rootAssetsPath);
        const { defaultPluginPath } = dataForTests(assetsPath);
        const { stdout } = await runPromptWithAnswers(assetsPath, ['plugin'], [`${ENTER}`]);

        expect(stripAnsi(stdout)).toContain(firstPrompt);

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
        const { stdout: stdout2 } = await runAsync(__dirname, ['--config', './my-webpack-plugin/examples/simple/webpack.config.js'], false);
        expect(stripAnsi(stdout2)).toContain('Hello World!');
    });

    it('should scaffold plugin template with a given name', async () => {
        const assetsPath = await uniqueDirectoryForTest(rootAssetsPath);
        const { pluginName, pluginPath } = dataForTests(assetsPath);
        const { stdout } = await runPromptWithAnswers(assetsPath, ['plugin'], [`${pluginName}${ENTER}`]);

        expect(stripAnsi(stdout)).toContain(firstPrompt);

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
        const { stdout: stdout2 } = await runAsync(__dirname, ['--config', './test-plugin/examples/simple/webpack.config.js'], false);
        expect(stripAnsi(stdout2)).toContain('Hello World!');
    });

    it('should scaffold plugin template in the specified path', async () => {
        const assetsPath = await uniqueDirectoryForTest(rootAssetsPath);
        const { pluginName, customPluginPath } = dataForTests(assetsPath);
        const { stdout } = await runPromptWithAnswers(assetsPath, ['plugin', 'test-assets'], [`${pluginName}${ENTER}`]);

        expect(stripAnsi(stdout)).toContain(firstPrompt);

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
        const { stdout: stdout2 } = await runAsync(customPluginPath, ['--config', './examples/simple/webpack.config.js'], false);
        expect(stripAnsi(stdout2)).toContain('Hello World!');
    });

    it('should scaffold plugin template in the current directory', async () => {
        const assetsPath = await uniqueDirectoryForTest(rootAssetsPath);
        const { genPath, customPluginPath, pluginName } = dataForTests(assetsPath);

        await mkdir(genPath);

        let { stdout } = await runPromptWithAnswers(genPath, ['plugin', './'], [`${pluginName}${ENTER}`]);

        expect(stripAnsi(stdout)).toContain(firstPrompt);

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
        const { stdout: stdout2 } = await runAsync(customPluginPath, ['--config', './examples/simple/webpack.config.js'], false);
        expect(stripAnsi(stdout2)).toContain('Hello World!');
    });

    it('should prompt on supplying an invalid template', () => {
        const { stderr } = run(__dirname, ['plugin', '--template=unknown']);
        expect(stderr).toContain('unknown is not a valid template');
    });
});
