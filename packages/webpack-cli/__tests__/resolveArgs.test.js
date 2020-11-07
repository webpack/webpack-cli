const { resolve } = require('path');
const webpackCLI = require('../lib/webpack-cli');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

const basicResolver = new webpackCLI().resolveArgs;

describe('BasicResolver', () => {
    it('should handle the output option', async () => {
        const result = await basicResolver({
            outputPath: './bundle',
        });
        expect(result.options.output.path).toEqual(resolve('bundle'));
    });

    it('should handle the mode option [production]', async () => {
        const result = await basicResolver(
            {
                mode: 'production',
            },
            {},
        );
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', async () => {
        const result = await basicResolver(
            {
                mode: 'development',
            },
            {},
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', async () => {
        const result = await basicResolver(
            {
                mode: 'none',
            },
            {},
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'none' });
        expect(result.options.mode).toEqual('none');
    });

    it('should prefer supplied move flag over NODE_ENV', async () => {
        process.env.NODE_ENV = 'production';
        const result = await basicResolver(
            {
                mode: 'development',
            },
            {},
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should prefer supplied move flag over mode from config', async () => {
        const result = await basicResolver(
            {
                mode: 'development',
            },
            { mode: 'production' },
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should prefer mode form config over NODE_ENV', async () => {
        process.env.NODE_ENV = 'development';
        const result = await basicResolver({}, { mode: 'production' });

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should prefer mode form flag over NODE_ENV and config', async () => {
        process.env.NODE_ENV = 'development';
        const result = await basicResolver({ mode: 'none' }, { mode: 'production' });

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'none' });
    });

    it('should assign json correctly', async () => {
        const result = await basicResolver({
            json: true,
        });
        expect(result.options.stats).toBeFalsy();
        expect(result.outputOptions.json).toBeTruthy();
    });

    it('should assign stats correctly', async () => {
        const result = await basicResolver({
            stats: 'warning',
        });
        expect(result.options.stats).toEqual('warning');
        expect(result.outputOptions.json).toBeFalsy();
    });

    it('should load the HMR plugin', async () => {
        const result = await basicResolver({
            hot: true,
        });
        expect(result.options.plugins[0].constructor.name).toEqual('HotModuleReplacementPlugin');
    });

    it('should load the prefetch plugin', async () => {
        const result = await basicResolver({
            prefetch: 'url',
        });
        expect(result.options.plugins[0].constructor.name).toEqual('PrefetchPlugin');
    });

    it('should load the webpack-bundle-analyzer plugin', async () => {
        const result = await basicResolver({
            analyze: true,
        });
        expect(result.options.plugins[0].constructor.name).toEqual('BundleAnalyzerPlugin');
    });

    {
        targetValues.map((option) => {
            it(`should handle ${option} option`, async () => {
                const result = await basicResolver({
                    target: option,
                });
                expect(result.options.target).toEqual(option);
            });
        });
    }
});
