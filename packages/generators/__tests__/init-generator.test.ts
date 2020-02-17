import { join } from 'path';
import { run } from 'yeoman-test';
const assert = require('yeoman-assert');

describe('init generator', () => {
    it('generates a webpack project config', async () => {
        const outputDir = await run(join(__dirname, '../init-generator')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index2',
            outputDir: 'dist2',
            langType: 'No',
            stylingType: 'No',
            useExtractPlugin: 'main',
        });

        // Check that all the project files are generator with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index2.js'];
        assert.file([...filePaths.map(file => join(outputDir, file))]);

        // Check generated file contents
        assert.fileContent(`${outputDir}/package.json`, '"name": "my-webpack-project"');
        assert.fileContent(`${outputDir}/README.md`, 'Welcome to your new awesome project!');
        assert.fileContent(`${outputDir}/src/index2.js`, 'console.log("Hello World from your main file!");');

        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.entry).toEqual("'./src/index2.js'");
        expect(config.output.path).toEqual("path.resolve(__dirname, 'dist2')");
    }, 10000);
});
