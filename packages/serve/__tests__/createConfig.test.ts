'use strict';

import createConfig from '../src/createConfig';

describe('createConfig', () => {
    it('creates config with arguments', () => {
        const args = {
            hot: true,
            openPage: 'main',
        };
        expect(createConfig(args, false)).toEqual(args);
    });

    it('sets client object using clientLogging argument', () => {
        const args = {
            clientLogging: 'verbose',
        };
        expect(createConfig(args, false)).toEqual({
            client: {
                logging: 'verbose',
            },
        });
    });

    it('sets hot using hotOnly argument', () => {
        const args = {
            hotOnly: true,
        };
        expect(createConfig(args, false)).toEqual({
            hotOnly: true,
        });
    });

    it('sets hot using hotOnly argument with devServer 4', () => {
        const args = {
            hotOnly: true,
        };
        expect(createConfig(args, true)).toEqual({
            hot: 'only',
        });
    });

    it('overrides hot with hotOnly', () => {
        const args = {
            hot: true,
            hotOnly: true,
        };
        expect(createConfig(args, false)).toEqual({
            hot: true,
            hotOnly: true,
        });
    });
});
