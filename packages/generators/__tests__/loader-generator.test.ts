import { join } from 'path';
import { run } from 'yeoman-test';
import assert from 'yeoman-assert';

import { makeLoaderName } from '../loader-generator';

describe('loader generator', () => {
    it('generates a default loader', async () => {
        const outputDir = await run(join(__dirname, '../loader-generator'));
        const loaderDir = `${outputDir}/my-loader`;
        const srcFiles = ['cjs.js', 'index.js'];
        const testFiles = ['functional.test.js', 'test-utils.js', 'unit.test.js', 'fixtures/simple-file.js'];
        const exampleFiles = ['webpack.config.js', 'src/index.js', 'src/lazy-module.js', 'src/static-esm-module.js'];

        // Check that files in all folders are scaffolded. Checking them separately so we know which directory has the problem
        // assert for src files
        assert.file([...srcFiles.map(file => `${loaderDir}/src/${file}`)]);

        // assert for test files
        assert.file([...testFiles.map(file => `${loaderDir}/test/${file}`)]);

        // assert for example files
        assert.file([...exampleFiles.map(file => `${loaderDir}/examples/simple/${file}`)]);

        // Check the contents of the webpack config and loader file
        assert.fileContent([
            [`${loaderDir}/examples/simple/webpack.config.js`, /resolveLoader: {/],
            [`${loaderDir}/src/index.js`, /export default function loader(source) {/],
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
