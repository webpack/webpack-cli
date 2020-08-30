const ConfigGroup = require('../../lib/groups/ConfigGroup');
const { resolve } = require('path');
const config1 = require('./webpack.config1.cjs');
const config2 = require('./webpack.config2.cjs');
const arrayConfig = require('./webpack.config.cjs');
const promiseConfig = require('./webpack.promise.config.cjs');

describe('ConfigGroup', function () {
    it('should handle merge properly', async () => {
        const group = new ConfigGroup([
            {
                merge: true,
            },
            {
                config: [resolve(__dirname, './webpack.config.cjs')],
            },
        ]);

        const result = await group.run();
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
        const group = new ConfigGroup([
            { config: [resolve(__dirname, './webpack.config1.cjs'), resolve(__dirname, './webpack.config2.cjs')] },
        ]);
        const result = await group.run();
        const expectedOptions = [config1, config2];
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });

    it('should return config object for single config', async () => {
        const group = new ConfigGroup([{ config: [resolve(__dirname, './webpack.config1.cjs')] }]);
        const result = await group.run();
        expect(result.options).toEqual(config1);
        expect(result.outputOptions).toEqual({});
    });

    it('should return resolved config object for promise config', async () => {
        const group = new ConfigGroup([{ config: [resolve(__dirname, './webpack.promise.config.cjs')] }]);
        const result = await group.run();
        const expectedOptions = await promiseConfig();
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });

    it('should handle configs returning different types', async () => {
        const group = new ConfigGroup([
            { config: [resolve(__dirname, './webpack.promise.config.cjs'), resolve(__dirname, './webpack.config.cjs')] },
        ]);
        const result = await group.run();
        const resolvedPromiseConfig = await promiseConfig();
        const expectedOptions = [resolvedPromiseConfig, ...arrayConfig];
        expect(result.options).toEqual(expectedOptions);
        expect(result.outputOptions).toEqual({});
    });
});
