const resolveMode = require('../lib/groups/resolveMode');

describe('resolveMode', function () {
    it('should handle the mode option [production]', () => {
        const result = resolveMode({
            mode: 'production',
        });
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', () => {
        const result = resolveMode({
            mode: 'development',
        });

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', () => {
        const result = resolveMode({
            mode: 'none',
        });

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'none' });
        expect(result.options.mode).toEqual('none');
    });
});
