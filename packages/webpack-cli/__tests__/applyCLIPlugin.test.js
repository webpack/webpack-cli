const webpackCLI = require('../lib/webpack-cli');
const CLIPlugin = require('../lib/plugins/CLIPlugin');

const applyCLIPlugin = new webpackCLI().applyCLIPlugin;

describe('CLIPluginResolver', () => {
    it('should add CLI plugin to single compiler object', async () => {
        const result = await applyCLIPlugin({ options: {} }, { hot: true, prefetch: true });
        expect(result.options.plugins[0] instanceof CLIPlugin).toBeTruthy();
        expect(result.options.plugins[0].options).toEqual({
            configPath: undefined,
            helpfulOutput: true,
            hot: true,
            progress: undefined,
            prefetch: true,
            analyze: undefined,
        });
    });
});
