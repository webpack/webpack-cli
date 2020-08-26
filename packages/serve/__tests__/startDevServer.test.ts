'use strict';

import startDevServer from '../src/startDevServer';

jest.mock('webpack-dev-server/lib/Server');

describe('startDevServer', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-extraneous-require
    const webpack = require('webpack');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DevServer = require('webpack-dev-server/lib/Server');

    beforeEach(() => {
        DevServer.mockClear();
    });

    it('should start dev server correctly for single compiler', () => {
        const config = {
            devServer: {
                port: 9000,
                hot: false,
                bonjour: true,
            },
        };
        const compiler = webpack(config);

        const servers = startDevServer(compiler, {
            host: 'my.host',
            hot: true,
            progress: true,
        });

        expect(servers.length).toEqual(1);
        expect(servers).toEqual(DevServer.mock.instances);

        // this is the constructor
        expect(DevServer.mock.calls.length).toEqual(1);
        // the 2nd argument is the options
        expect(DevServer.mock.calls[0][1]).toMatchSnapshot();

        // the server should listen on correct host and port
        expect(DevServer.mock.instances[0].listen.mock.calls.length).toEqual(1);
        expect(DevServer.mock.instances[0].listen.mock.calls[0]).toMatchSnapshot();
    });

    it('should set default port and host if not provided', () => {
        const config = {
            devServer: {},
        };
        const compiler = webpack(config);

        const servers = startDevServer(compiler, {});

        expect(servers.length).toEqual(1);
        expect(servers).toEqual(DevServer.mock.instances);

        // this is the constructor
        expect(DevServer.mock.calls.length).toEqual(1);
        // the 2nd argument is the options
        expect(DevServer.mock.calls[0][1]).toMatchSnapshot();

        // the server should listen on correct host and port
        expect(DevServer.mock.instances[0].listen.mock.calls.length).toEqual(1);
        expect(DevServer.mock.instances[0].listen.mock.calls[0]).toMatchSnapshot();
    });

    it('should start dev server correctly for multi compiler with 1 devServer config', () => {
        const config = [
            {
                devServer: {
                    port: 9000,
                    hot: false,
                    bonjour: true,
                },
            },
            {},
        ];
        const compiler = webpack(config);

        const servers = startDevServer(compiler, {
            host: 'my.host',
            hot: true,
            progress: true,
        });

        expect(servers.length).toEqual(1);
        expect(servers).toEqual(DevServer.mock.instances);

        // this is the constructor
        expect(DevServer.mock.calls.length).toEqual(1);
        // the 2nd argument is the options
        expect(DevServer.mock.calls[0][1]).toMatchSnapshot();

        // the server should listen on correct host and port
        expect(DevServer.mock.instances[0].listen.mock.calls.length).toEqual(1);
        expect(DevServer.mock.instances[0].listen.mock.calls[0]).toMatchSnapshot();
    });

    it('should start dev servers correctly for multi compiler with 2 devServer configs', () => {
        const config = [
            {
                devServer: {
                    port: 9000,
                    // here to show that it will be overridden
                    progress: false,
                },
            },
            {
                devServer: {
                    port: 9001,
                },
            },
        ];
        const compiler = webpack(config);

        const servers = startDevServer(compiler, {
            // this progress CLI flag should override progress: false above
            progress: true,
        });

        // there are 2 devServer configs, so both are run
        expect(servers.length).toEqual(2);
        expect(servers).toEqual(DevServer.mock.instances);

        // this is the constructor
        expect(DevServer.mock.calls.length).toEqual(2);
        // the 2nd argument is the options
        expect(DevServer.mock.calls[0][1]).toMatchSnapshot();
        expect(DevServer.mock.calls[1][1]).toMatchSnapshot();

        // both servers should listen on correct host and port

        expect(DevServer.mock.instances[0].listen.mock.calls.length).toEqual(1);
        expect(DevServer.mock.instances[0].listen.mock.calls[0]).toMatchSnapshot();

        expect(DevServer.mock.instances[1].listen.mock.calls.length).toEqual(1);
        expect(DevServer.mock.instances[1].listen.mock.calls[0]).toMatchSnapshot();
    });

    it('should handle 2 multi compiler devServer configs with conflicting ports', () => {
        expect(() => {
            const config = [
                {
                    devServer: {
                        port: 9000,
                    },
                },
                {
                    devServer: {
                        port: 9000,
                    },
                },
            ];
            const compiler = webpack(config);

            startDevServer(compiler, {});
        }).toThrow(
            'Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.',
        );
    });
});
