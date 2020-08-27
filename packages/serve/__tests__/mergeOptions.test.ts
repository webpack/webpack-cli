'use strict';

import mergeOptions from '../src/mergeOptions';

describe('mergeOptions', () => {
    it('merges CLI and devServer options correctly', () => {
        const cliOptions = {
            client: {
                logging: 'verbose',
            },
            hot: true,
            bonjour: true,
        };
        const devServerOptions = {
            client: {
                host: 'localhost',
                logging: 'none',
            },
            hot: false,
            liveReload: false,
        };
        // CLI should take priority
        expect(mergeOptions(cliOptions, devServerOptions)).toEqual({
            client: {
                host: 'localhost',
                logging: 'verbose',
            },
            hot: true,
            bonjour: true,
            liveReload: false,
        });
    });
});
