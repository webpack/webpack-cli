const ZeroConfigGroup = require('../lib/groups/ZeroConfigGroup');

describe('ZeroConfigGroup', function () {
    it('should load the dev zero config', () => {
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

    it('should use mode when mode and dev both are provided', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'production',
                dev: true,
            },
        ]);

        const result = group.run();
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should use mode when mode and prod both are provided', () => {
        const group = new ZeroConfigGroup([
            {
                mode: 'development',
                prod: true,
            },
        ]);

        const result = group.run();
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should set mode=production by default', () => {
        const group = new ZeroConfigGroup([{}]);

        const result = group.run();
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
    });
});
