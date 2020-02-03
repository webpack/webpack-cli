import { join } from 'path';
import { run } from 'yeoman-test';

// fixme: unstable
describe.skip('init generator', () => {
    it('generates a webpack project config', async () => {
        const outputDir = await run(join(__dirname, '../init-generator')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index2',
            outputDir: 'dist2',
            langType: 'No',
            stylingType: 'No',
            useExtractPlugin: 'main',
        });
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.entry).toEqual("'./src/index2.js'");
        expect(config.output.path).toEqual("path.resolve(__dirname, 'dist2')");
    });
});
