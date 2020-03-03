'use strict';
const { join } = require('path');
const { run } = require('../utils/test-utils');
const webpack = require('webpack');

describe('json flag', () => {
    it.skip('should match the snapshot of --json command', async () => {
        const { stdout } = run(__dirname, [__dirname, '--json']);
        const jsonstdout = JSON.parse(stdout);
        const compiler = await webpack({
            entry: './index.js',
            output: {
                filename: 'main.js',
                path: join(__dirname, 'bin'),
            },
        });
        compiler.run((err, stats) => {
            expect(err).toBeFalsy();
            const webpackStats = stats.toJson({ json: true });
            expect(jsonstdout).toEqual(webpackStats);
        });
    });
});
