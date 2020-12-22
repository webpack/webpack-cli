const { resolve } = require('path');
const { version } = require('webpack');
const webpackCLI = require('../lib/webpack-cli');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];
const statsPresets = ['normal', 'detailed', 'errors-only', 'errors-warnings', 'minimal', 'verbose', 'none'];

if (version.startsWith('5')) {
    statsPresets.push('summary');
}

const applyOptions = new webpackCLI().applyOptions;

describe('BasicResolver', () => {
    it('should handle the output option', async () => {
        const result = await applyOptions({ options: {} }, { outputPath: './bundle' });

        expect(result.options.output.path).toEqual(resolve('bundle'));
    });

    it('should handle the mode option [production]', async () => {
        const result = await applyOptions({ options: {} }, { mode: 'production' });

        expect(result.options).toMatchObject({ mode: 'production' });
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', async () => {
        const result = await applyOptions(
            { options: {} },
            {
                mode: 'development',
            },
        );

        expect(result.options).toMatchObject({ mode: 'development' });
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', async () => {
        const result = await applyOptions(
            { options: {} },
            {
                mode: 'none',
            },
        );

        expect(result.options).toMatchObject({ mode: 'none' });
        expect(result.options.mode).toEqual('none');
    });

    it('should prefer supplied move flag over NODE_ENV', async () => {
        process.env.NODE_ENV = 'production';
        const result = await applyOptions({ options: {} }, { mode: 'development' });

        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should prefer supplied move flag over mode from config', async () => {
        const result = await applyOptions({ options: { mode: 'development' } }, { mode: 'production' });

        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should prefer mode form config over NODE_ENV', async () => {
        process.env.NODE_ENV = 'development';
        const result = await applyOptions({ options: {} }, { mode: 'production' });

        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should prefer mode form flag over NODE_ENV and config', async () => {
        process.env.NODE_ENV = 'development';
        const result = await applyOptions({ options: {} }, {});

        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should assign stats correctly', async () => {
        const result = await applyOptions({ options: {} }, { stats: 'errors-warnings' });

        expect(result.options.stats).toEqual('errors-warnings');
    });

    targetValues.map((option) => {
        it(`should handle ${option} option`, async () => {
            const result = await applyOptions({ options: {} }, { target: option });

            expect(result.options.target).toEqual(option);
        });
    });

    statsPresets.map((preset) => {
        it(`should handle ${preset} preset`, async () => {
            const result = await applyOptions({ options: {} }, { stats: preset });

            expect(result.options.stats).toEqual(preset);
        });
    });
});
