const ConfigGroup = require('../../lib/groups/ConfigGroup');
const { resolve } = require('path');

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
});
