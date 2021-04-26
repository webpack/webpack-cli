const capitalizeFirstLetter = require('../../packages/webpack-cli/lib/utils/capitalize-first-letter');

describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
        expect(capitalizeFirstLetter('webpack')).toEqual('Webpack');
    });

    it('should return empty string, when passed not string value', () => {
        expect(capitalizeFirstLetter(true)).toEqual('');
    });
});
