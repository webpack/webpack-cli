'use strict';

const { resolve } = require('path');
const { runAsync, readdir } = require('../../../utils/test-utils');

describe('source-map object', () => {
    it('should treat source-map settings right', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        let files;

        try {
            files = await readdir(resolve(__dirname, 'dist'));
        } catch (error) {
            expect(error).toBe(null);
        }

        expect(files.length).toBe(3);
    });

    it('should override entire array on flag', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--devtool', 'source-map', '--output-path', './binary'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        let files;

        try {
            files = await readdir(resolve(__dirname, 'binary'));
        } catch (error) {
            expect(error).toBe(null);
        }

        expect(files.length).toBe(4);
    });
});
