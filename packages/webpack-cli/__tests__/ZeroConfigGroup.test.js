const ZeroConfigGroup = require('../lib/groups/ZeroConfigGroup');

describe('ZeroConfigGroup', function () {
    it('should handle the mode option [production]', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'production',
            },
        ]);
        const result = group.run();
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'development',
            },
        ]);

        const result = group.run();
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'none',
            },
        ]);

        const result = group.run();
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'none' });
        expect(result.options.mode).toEqual('none');
    });
});
