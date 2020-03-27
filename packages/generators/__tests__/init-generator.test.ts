import * as assert from 'yeoman-assert';
import { run } from 'yeoman-test';
import { join } from 'path';

describe('init generator', () => {
    it('generates a webpack project config', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index2',
            outputDir: 'dist2',
            langType: 'No',
            stylingType: 'No',
            useExtractPlugin: 'main',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index2.js'];
        assert.file(filePaths.map(file => join(outputDir, file)));

        // Check generated file contents
        assert.fileContent(join(outputDir, 'package.json'), '"name": "my-webpack-project"');
        assert.fileContent(join(outputDir, 'README.md'), 'Welcome to your new awesome project!');
        assert.fileContent(join(outputDir, 'src', 'index2.js'), 'console.log("Hello World from your main file!");');
        assert.file(join(outputDir, 'sw.js'));

        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.entry).toEqual("'./src/index2.js'");
        expect(config.output.path).toEqual("path.resolve(__dirname, 'dist2')");
    }, 10000);
});
