'use strict';

import mergeOptions from '../src/mergeOptions';
import { devServerClientLogging } from '../src/types';

describe('mergeOptions', () => {
    it('merges CLI and devServer options correctly', () => {
        const cliOptions = {
            client: {
                logging: devServerClientLogging.verbose,
            },
            hot: true,
            bonjour: true,
        };
        const devServerOptions = {
            client: {
                host: 'localhost',
                logging: devServerClientLogging.none,
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
