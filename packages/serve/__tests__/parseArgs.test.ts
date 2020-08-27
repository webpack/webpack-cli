'use strict';

// TODO: update snapshots once we update to webpack-dev-server@4

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
        const args = parseArgs(cli, ['--bonjour', '--target=node', '--port', '8080']);
        expect(args).toMatchSnapshot();
        expect(errorMock.mock.calls.length).toEqual(0);
        expect(processExitSpy.mock.calls.length).toEqual(0);
    });

    it('handles hot arg', () => {
        const args = parseArgs(cli, ['--hot']);
        expect(args).toMatchSnapshot();
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
