import { replaceAt, generatePluginName } from '../../lib/utils/plugins';

describe('plugins', () => {
    it('generates plugin name', () => {
        expect(generatePluginName('my-plugin-name')).toEqual('MyPluginName');
    });

    it('generates plugin name with numbers', () => {
        expect(generatePluginName('my-plugin-name-1')).toEqual('MyPluginName1');
    });

    it('replaceAt capitalizes first letter', () => {
        expect(replaceAt('mystring', 0, 'M')).toEqual('Mystring');
    });

    it('replaceAt replaces within string', () => {
        expect(replaceAt('mystring', 2, '-inserted-')).toEqual('my-inserted-tring');
    });

    it('replaceAt replaces at end of string', () => {
        expect(replaceAt('mystring', 7, '-inserted-')).toEqual('mystrin-inserted-');
    });
});
