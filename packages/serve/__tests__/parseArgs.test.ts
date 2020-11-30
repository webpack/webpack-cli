'use strict';
// eslint-disable-next-line node/no-extraneous-import
import { version as devServerVersion } from 'webpack-dev-server/package.json';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorMock: any = jest.fn();
jest.mock('webpack-cli/lib/utils/logger', () => {
    return {
        error: errorMock,
    };
});

import WebpackCLI from 'webpack-cli';
import parseArgs from '../src/parseArgs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processExitSpy: any = jest.spyOn(process, 'exit');
// eslint-disable-next-line @typescript-eslint/no-empty-function
processExitSpy.mockImplementation(() => {});

describe('parseArgs', () => {
    const cli = new WebpackCLI();

    beforeEach(() => {
        errorMock.mockClear();
        processExitSpy.mockClear();
    });

    it('parses webpack and dev server args', () => {
        const args = parseArgs(cli, ['--bonjour', '--mode=development', '--port', '8080']);
        if (devServerVersion.startsWith('4')) {
            expect(args).toMatchInlineSnapshot(`
                Object {
                  "devServerArgs": Object {
                    "bonjour": true,
                    "port": 8080,
                    "setupExitSignals": true,
                  },
                  "webpackArgs": Object {
                    "env": Object {
                      "WEBPACK_SERVE": true,
                    },
                    "mode": "development",
                  },
                }
            `);
        } else {
            expect(args).toMatchInlineSnapshot(`
                Object {
                  "devServerArgs": Object {
                    "bonjour": true,
                    "clientLogLevel": "info",
                    "inline": true,
                    "liveReload": true,
                    "port": 8080,
                    "serveIndex": true,
                  },
                  "webpackArgs": Object {
                    "env": Object {
                      "WEBPACK_SERVE": true,
                    },
                    "mode": "development",
                  },
                }
            `);
        }
        expect(errorMock.mock.calls.length).toEqual(0);
        expect(processExitSpy.mock.calls.length).toEqual(0);
    });

    it('handles hot arg', () => {
        const args = parseArgs(cli, ['--hot']);
        if (devServerVersion.startsWith('4')) {
            expect(args).toMatchInlineSnapshot(`
                Object {
                  "devServerArgs": Object {
                    "hot": true,
                    "setupExitSignals": true,
                  },
                  "webpackArgs": Object {
                    "env": Object {
                      "WEBPACK_SERVE": true,
                    },
                    "hot": true,
                  },
                }
            `);
        } else {
            expect(args).toMatchInlineSnapshot(`
                Object {
                  "devServerArgs": Object {
                    "clientLogLevel": "info",
                    "hot": true,
                    "inline": true,
                    "liveReload": true,
                    "serveIndex": true,
                  },
                  "webpackArgs": Object {
                    "env": Object {
                      "WEBPACK_SERVE": true,
                    },
                    "hot": true,
                  },
                }
            `);
        }
        expect(errorMock.mock.calls.length).toEqual(0);
        expect(processExitSpy.mock.calls.length).toEqual(0);
    });

    it('handles unknown args', () => {
        parseArgs(cli, ['--unknown-arg', '--unknown-arg-2']);
        expect(errorMock.mock.calls).toMatchSnapshot();
        expect(processExitSpy.mock.calls.length).toEqual(1);
        expect(processExitSpy.mock.calls[0]).toEqual([2]);
    });
});
