import { join } from 'path';
import { run } from 'yeoman-test';
import * as assert from 'yeoman-assert';

import { makeLoaderName } from '../src/loader-generator';

describe('loader generator', () => {
    it('generates a default loader', async () => {
        const loaderName = 'my-test-loader';
        const outputDir = await run(join(__dirname, '../src/loader-generator.ts')).withPrompts({
            name: loaderName,
        });
        const loaderDir = join(outputDir, loaderName);
        const srcFiles = ['cjs.js', 'index.js'];
        const testFiles = ['functional.test.js', 'test-utils.js', 'unit.test.js', 'fixtures/simple-file.js'];
        const exampleFiles = ['webpack.config.js', 'src/index.js', 'src/lazy-module.js', 'src/static-esm-module.js'];

        // Check that files in all folders are scaffolded. Checking them separately so we know which directory has the problem
        // assert for src files
        assert.file(srcFiles.map((file) => join(loaderDir, 'src', file)));

        // assert for test files
        assert.file(testFiles.map((file) => join(loaderDir, 'test', file)));

        // assert for example files
        assert.file(exampleFiles.map((file) => join(loaderDir, 'examples/simple', file)));

        // Check the contents of the webpack config and loader file
        assert.fileContent([
            [join(loaderDir, 'examples/simple/webpack.config.js'), /resolveLoader: {/],
            [join(loaderDir, 'src/index.js'), /module.exports = function loader\(source\) {/],
            [join(loaderDir, 'package.json'), new RegExp(loaderName)],
        ]);

        // higher timeout so travis has enough time to execute
    }, 10000);
});

describe('makeLoaderName', () => {
    it("should kebab-case loader name and append '-loader'", () => {
        const loaderName = makeLoaderName('This is a test');
        expect(loaderName).toEqual('this-is-a-test-loader');
    });

    it('should not modify a properly formatted loader name', () => {
        const loaderName = makeLoaderName('properly-named-loader');
        expect(loaderName).toEqual('properly-named-loader');
    });
});
