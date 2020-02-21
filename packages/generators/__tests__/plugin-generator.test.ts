import { join } from 'path';
import { run } from 'yeoman-test';
import assert from 'yeoman-assert';

import { generatePluginName } from '../src/utils';

describe('plugin generator', () => {
    it.skip('generates a default plugin', async () => {
        const outputDir = await run(join(__dirname, '../plugin-generator'));
        const pluginDir = `${outputDir}/my-webpack-plugin`;
        const srcFiles = ['cjs.js', 'index.js'];
        const testFiles = ['functional.test.js', 'test-utils.js'];
        const exampleFiles = ['webpack.config.js', 'src/index.js', 'src/lazy-module.js', 'src/static-esm-module.js'];

        // Check that files in all folders are scaffolded. Checking them separately so we know which directory has the problem
        // assert for src files
        assert.file([...srcFiles.map(file => `${pluginDir}/src/${file}`)]);

        // assert for test files
        assert.file([...testFiles.map(file => `${pluginDir}/test/${file}`)]);

        // assert for example files
        assert.file([...exampleFiles.map(file => `${pluginDir}/examples/simple/${file}`)]);

        // Check the contents of the webpack config and loader file
        assert.fileContent([
            [`${pluginDir}/examples/simple/webpack.config.js`, /new MyWebpackPlugin()/],
            [`${pluginDir}/src/index.js`, /MyWebpackPlugin.prototype.apply = function(compiler) {/],
        ]);

        // higher timeout so travis has enough time to execute
    }, 10000);
});

describe('generate plugin name', () => {
    it('should return webpack Standard Plugin Name for Name : extract-text-webpack-plugin', () => {
        const pluginName = generatePluginName('extract-text-webpack-plugin');
        expect(pluginName).toEqual('ExtractTextWebpackPlugin');
    });

    it('should return webpack Standard Plugin Name for Name : webpack.DefinePlugin', () => {
        const pluginName = generatePluginName('webpack.DefinePlugin');
        expect(pluginName).toEqual('webpack.DefinePlugin');
    });
});
