const { resolve } = require('path');
const webpackCLI = require('../lib/webpack-cli');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];
const cli = new webpackCLI();

describe('BasicResolver', () => {
    it('should handle the output option', async () => {
        const result = await cli.applyOptions({ options: {} }, { outputPath: './bundle' });

        expect(result.options.output.path).toEqual(resolve('bundle'));
    });

    it('should handle the mode option [production]', async () => {
        const result = await cli.applyOptions({ options: {} }, { mode: 'production' });

        expect(result.options).toMatchObject({ mode: 'production' });
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', async () => {
        const result = await cli.applyOptions(
            { options: {} },
            {
                mode: 'development',
            },
        );

        expect(result.options).toMatchObject({ mode: 'development' });
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', async () => {
        const result = await cli.applyOptions(
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
        const result = await cli.applyOptions({ options: {} }, { mode: 'development' });

        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should prefer supplied move flag over mode from config', async () => {
        const result = await cli.applyOptions({ options: { mode: 'development' } }, { mode: 'production' });

        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should prefer mode form config over NODE_ENV', async () => {
        process.env.NODE_ENV = 'development';
        const result = await cli.applyOptions({ options: {} }, { mode: 'production' });

        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should prefer mode form flag over NODE_ENV and config', async () => {
        process.env.NODE_ENV = 'development';
        const result = await cli.applyOptions({ options: {} }, {});

        expect(result.options).toMatchObject({ mode: 'development' });
    });

    targetValues.map((option) => {
        it(`should handle ${option} option`, async () => {
            const result = await cli.applyOptions({ options: {} }, { target: option });

            expect(result.options.target).toEqual(option);
        });
    });
});
