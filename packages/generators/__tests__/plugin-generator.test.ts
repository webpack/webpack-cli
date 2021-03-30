import { join } from 'path';
// eslint-disable-next-line node/no-extraneous-import
import { run } from 'yeoman-test';
import * as assert from 'yeoman-assert';
import utils from '../../webpack-cli/lib/utils';

describe('plugin generator', () => {
    it('generates a default plugin', async () => {
        const pluginName = 'my-test-plugin';
        const { cwd: outputDir } = await run(join(__dirname, '../src/plugin-generator.ts'))
            .withPrompts({
                name: pluginName,
            })
            .withOptions({ cli: { utils } });
        const pluginDir = join(outputDir, pluginName);
        const srcFiles = ['cjs.js', 'index.js'];
        const testFiles = ['functional.test.js', 'test-utils.js'];
        const exampleFiles = ['webpack.config.js', 'src/index.js', 'src/lazy-module.js', 'src/static-esm-module.js'];

        // Check that files in all folders are scaffolded. Checking them separately so we know which directory has the problem
        // assert for src files
        assert.file(srcFiles.map((file) => join(pluginDir, 'src', file)));

        // assert for test files
        assert.file(testFiles.map((file) => join(pluginDir, 'test', file)));

        // assert for example files
        assert.file(exampleFiles.map((file) => join(pluginDir, 'examples/simple', file)));

        // Check the contents of the webpack config and loader file
        assert.fileContent([
            [join(pluginDir, 'examples/simple/webpack.config.js'), /new MyTestPlugin\(\)/],
            [join(pluginDir, 'src/index.js'), /compiler\.hooks\.done\.tap/],
            [join(pluginDir, 'package.json'), new RegExp(pluginName)],
        ]);

        // higher timeout so travis has enough time to execute
    }, 10000);
});
