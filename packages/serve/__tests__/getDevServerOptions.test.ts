'use strict';

import getDevServerOptions from '../src/getDevServerOptions';

describe('getDevServerOptions', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-extraneous-require
    const webpack = require('webpack');

    it('gets dev server options from single compiler', () => {
        const compiler = webpack({
            devServer: {
                hot: true,
                host: 'my.host',
            },
        });
        expect(getDevServerOptions(compiler)).toEqual([
            {
                hot: true,
                host: 'my.host',
            },
        ]);
    });

    it('gets dev server options from multi compiler', () => {
        const compiler = webpack([
            {
                devServer: {
                    hot: true,
                    host: 'my.host',
                },
            },
            {
                devServer: {
                    hot: false,
                    host: 'other.host',
                },
            },
        ]);

        expect(getDevServerOptions(compiler)).toEqual([
            {
                hot: true,
                host: 'my.host',
            },
            {
                hot: false,
                host: 'other.host',
            },
        ]);
    });
});
