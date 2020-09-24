const resolveMode = require('../lib/groups/resolveMode');

describe('resolveMode', function () {
    it('should handle the mode option [production]', () => {
        const result = resolveMode(
            {
                mode: 'production',
            },
            {},
        );
        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
        expect(result.options.mode).toEqual('production');
    });

    it('should handle the mode option [development]', () => {
        const result = resolveMode(
            {
                mode: 'development',
            },
            {},
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
        expect(result.options.mode).toEqual('development');
    });

    it('should handle the mode option [none]', () => {
        const result = resolveMode(
            {
                mode: 'none',
            },
            {},
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'none' });
        expect(result.options.mode).toEqual('none');
    });

    it('should prefer supplied move flag over NODE_ENV', () => {
        process.env.NODE_ENV = 'production';
        const result = resolveMode(
            {
                mode: 'development',
            },
            {},
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should prefer supplied move flag over mode from config', () => {
        const result = resolveMode(
            {
                mode: 'development',
            },
            { mode: 'production' },
        );

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'development' });
    });

    it('should prefer mode form config over NODE_ENV', () => {
        process.env.NODE_ENV = 'development';
        const result = resolveMode({}, { mode: 'production' });

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'production' });
    });

    it('should prefer mode form flag over NODE_ENV and config', () => {
        process.env.NODE_ENV = 'development';
        const result = resolveMode({ mode: 'none' }, { mode: 'production' });

        // ensure no other properties are added
        expect(result.options).toMatchObject({ mode: 'none' });
    });
});
