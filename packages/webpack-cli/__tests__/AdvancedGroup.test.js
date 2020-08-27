const AdvancedGroup = require('../lib/groups/AdvancedGroup');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('AdvancedGroup', function () {
    it('should load the HMR Plugin', () => {
        const group = new AdvancedGroup([
            {
                hot: true,
            },
        ]);

        const result = group.run();
        expect(result.options.plugins[0].constructor.name).toEqual('HotModuleReplacementPlugin');
    });

    it('should load the Prefetch Plugin', () => {
        const group = new AdvancedGroup([
            {
                prefetch: 'url',
            },
        ]);

        const result = group.run();
        expect(result.options.plugins[0].constructor.name).toEqual('PrefetchPlugin');
    });

    {
        targetValues.map((option) => {
            it(`should handle ${option} option`, () => {
                const group = new AdvancedGroup([
                    {
                        target: option,
                    },
                ]);

                const result = group.run();
                expect(result.options.target).toEqual(option);
            });
        });
    }
});
