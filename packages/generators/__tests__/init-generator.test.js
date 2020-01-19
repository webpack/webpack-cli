const path = require('path');
const helpers = require('yeoman-test');

it('generates a webpack project config', async () => {
    const outputDir = await helpers.run(path.join(__dirname, '../init-generator'))
        .withPrompts({
            multiEntries: false,
            singularEntry: 'src/index2',
            outputDir: 'dist2',
            langType: 'No',
            stylingType: 'No',
            useExtractPlugin: 'main',
        });
    const output = require(path.join(outputDir, '.yo-rc.json'));
    const config = Object.entries(output)[0][1].configuration.config.webpackOptions;
    expect(config.entry).toEqual('\'./src/index2.js\'');
    expect(config.output.path).toEqual('path.resolve(__dirname, \'dist2\')');
});
