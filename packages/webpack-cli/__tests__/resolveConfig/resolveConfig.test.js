const { resolve } = require('path');
const WebpackCLI = require('../../lib/webpack-cli');
const config1 = require('./webpack.config1.cjs');
const config2 = require('./webpack.config2.cjs');
const arrayConfig = require('./webpack.config.cjs');
const promiseConfig = require('./webpack.promise.config.cjs');

const resolveConfig = new WebpackCLI().resolveConfig;

describe('resolveConfig', function () {
    it('should handle merge properly', async () => {
        const result = await resolveConfig({
            merge: true,
            config: [resolve(__dirname, './webpack.config.cjs')],
        });

        const expectedOptions = {
            output: { filename: './dist-commonjs.js', libraryTarget: 'commonjs' },
            entry: './a.js',
            name: 'amd',
            mode: 'production',
            devtool: 'eval-cheap-module-source-map',
            target: 'node',
        };
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });

    it('should return array for multiple config', async () => {
        const result = await resolveConfig({
            config: [resolve(__dirname, './webpack.config1.cjs'), resolve(__dirname, './webpack.config2.cjs')],
        });
        const expectedOptions = [config1, config2];
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });

    it('should return config object for single config', async () => {
        const result = await resolveConfig({ config: [resolve(__dirname, './webpack.config1.cjs')] });
        expect(result.options).toEqual(config1);
        expect(result.outputOptions).toEqual({});
    });

    it('should return resolved config object for promise config', async () => {
        const result = await resolveConfig({ config: [resolve(__dirname, './webpack.promise.config.cjs')] });
        const expectedOptions = await promiseConfig();
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });

    it('should handle configs returning different types', async () => {
        const result = await resolveConfig({
            config: [resolve(__dirname, './webpack.promise.config.cjs'), resolve(__dirname, './webpack.config.cjs')],
        });
        const resolvedPromiseConfig = await promiseConfig();
        const expectedOptions = [resolvedPromiseConfig, ...arrayConfig];
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });

    it('should handle different env formats', async () => {
        const result = await resolveConfig({
            env: { test: true, name: 'Hisoka' },
            config: [resolve(__dirname, './env.webpack.config.cjs')],
        });
        const expectedOptions = { mode: 'staging', name: 'Hisoka' };
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });
});
