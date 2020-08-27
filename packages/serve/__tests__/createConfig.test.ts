'use strict';

import createConfig from '../src/createConfig';

describe('createConfig', () => {
    it('creates config with arguments', () => {
        const args = {
            hot: true,
            openPage: 'main',
        };
        expect(createConfig(args)).toEqual(args);
    });

    it('sets client object using clientLogging argument', () => {
        const args = {
            clientLogging: 'verbose',
        };
        expect(createConfig(args)).toEqual({
            client: {
                logging: 'verbose',
            },
        });
    });

    it('sets hot using hotOnly argument', () => {
        const args = {
            hotOnly: true,
        };
        expect(createConfig(args)).toEqual({
            hot: 'only',
        });
    });

    it('overrides hot with hotOnly', () => {
        const args = {
            hot: true,
            hotOnly: true,
        };
        expect(createConfig(args)).toEqual({
            hot: 'only',
        });
    });
});
