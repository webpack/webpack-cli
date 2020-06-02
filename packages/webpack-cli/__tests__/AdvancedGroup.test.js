const AdvancedGroup = require('../lib/groups/AdvancedGroup');

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
});
