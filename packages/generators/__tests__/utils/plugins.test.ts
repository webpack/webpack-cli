import { replaceAt, generatePluginName } from '../../lib/utils/plugins';

describe('generate plugin name', () => {
    it('should return webpack Standard Plugin Name for Name : extract-text-webpack-plugin', () => {
        const pluginName = generatePluginName('extract-text-webpack-plugin');
        expect(pluginName).toEqual('ExtractTextWebpackPlugin');
    });

    it('should return webpack Standard Plugin Name for Name : webpack.DefinePlugin', () => {
        const pluginName = generatePluginName('webpack.DefinePlugin');
        expect(pluginName).toEqual('webpack.DefinePlugin');
    });

    it('should return webpack Standard Plugin Name for Name : my-plugin-name-1', () => {
        const pluginName = generatePluginName('my-plugin-name-1');
        expect(pluginName).toEqual('MyPluginName1');
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
