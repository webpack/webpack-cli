'use strict';

import mergeOptions from '../src/mergeOptions';

describe('mergeOptions', () => {
    it('merges CLI and devServer options correctly', () => {
        const cliOptions = {
            client: {
                logging: 'verbose',
            },
            // hot: true,
            // openPage: 'main',
        };
        const devServerOptions = {};
        expect(mergeOptions(cliOptions, devServerOptions)).toEqual({});
    });
});
