'use strict';

import startDevServer from '../src/startDevServer';

describe('startDevServer', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webpack = require('webpack');

    it('should start dev server correctly for single compiler', () => {
        const config = {
            devServer: {
                // TODO: switch to static for dev server v4
                watchContentBase: false,
            },
        };
        const compiler = webpack(config);

        startDevServer(compiler, ['--hot-only']);
    });

    // it('should start dev server correctly for multi compiler with 1 devServer config', () => {

    // });

    // it('should start dev servers correctly for multi compiler with 2 devServer configs', () => {

    // });

    // it('should handle 2 multi compiler devServer configs with conflicting ports', () => {

    // });
});
