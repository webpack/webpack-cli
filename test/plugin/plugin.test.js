const { existsSync } = require('fs');
const { join } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const ENTER = '\x0D';
const firstPrompt = '? Plugin name';
const pluginName = 'test-plugin';
const pluginPath = join(__dirname, pluginName);

// Since scaffolding is time consuming
jest.setTimeout(40000);

describe('plugin command', () => {
    beforeAll(() => {
        rimraf.sync(pluginPath);
    });

    afterAll(() => {
        rimraf.sync(pluginPath);
    });

    it('Should ask the plugin name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['plugin'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold plugin template with a given name', async () => {
        const { stdout } = await runPromptWithAnswers(__dirname, ['plugin'], [`${pluginName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // check if the output directory exists with the appropriate plugin name
        expect(existsSync(join(__dirname, pluginName))).toBeTruthy();

        // Test regressively files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(join(__dirname, `${pluginName}/${file}`))).toBeTruthy();
        });
    });
});
