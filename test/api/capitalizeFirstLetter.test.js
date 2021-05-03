const capitalizeFirstLetter = require('../../packages/webpack-cli/build/lib/utils/capitalize-first-letter');

describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
        expect(capitalizeFirstLetter('webpack')).toEqual('Webpack');
    });

    it('should return an empty string on passing a non-string value', () => {
        expect(capitalizeFirstLetter(true)).toEqual('');
    });
});
