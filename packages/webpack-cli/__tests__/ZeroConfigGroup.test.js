const ZeroConfigGroup = require('../lib/groups/ZeroConfigGroup');

describe('GroupHelper', function() {
    it('should  load the dev zero config', () => {
        const group = new ZeroConfigGroup([
            {
                dev: true,
            },
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('development');
    });
    it('should load the prod zero config', () => {
        const group = new ZeroConfigGroup([
            {
                prod: true,
            },
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('production');
    });
    it('should handle the mode option [production]', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'production',
            },
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'development',
            },
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'none',
            },
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('none');
    });
});
