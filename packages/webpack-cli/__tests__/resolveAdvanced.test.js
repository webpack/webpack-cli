const resolveAdvanced = require('../lib/groups/resolveAdvanced');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('advanced options', function () {
    it('should load the HMR plugin', async () => {
        const result = await resolveAdvanced({
            hot: true,
        });
        expect(result.options.plugins[0].constructor.name).toEqual('HotModuleReplacementPlugin');
    });

    it('should load the prefetch plugin', async () => {
        const result = await resolveAdvanced({
            prefetch: 'url',
        });
        expect(result.options.plugins[0].constructor.name).toEqual('PrefetchPlugin');
    });

    it('should load the webpack-bundle-analyzer plugin', async () => {
        const result = await resolveAdvanced({
            analyze: true,
        });
        expect(result.options.plugins[0].constructor.name).toEqual('BundleAnalyzerPlugin');
    });

    {
        targetValues.map((option) => {
            it(`should handle ${option} option`, async () => {
                const result = await resolveAdvanced({
                    target: option,
                });
                expect(result.options.target).toEqual(option);
            });
        });
    }
});
