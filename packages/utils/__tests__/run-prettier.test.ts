'use strict';

import fs from 'fs';
import path from 'path';
//eslint-disable-next-line node/no-extraneous-import
import rimraf from 'rimraf';
import { runPrettier } from '../src/run-prettier';

const outputPath = path.join(__dirname, 'test-assets');
const outputFile = path.join(outputPath, 'test.js');
const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

describe('runPrettier', () => {
    beforeEach(() => {
        rimraf.sync(outputPath);
        fs.mkdirSync(outputPath);
    });

    afterAll(() => {
        rimraf.sync(outputPath);
    });

    it('should run prettier on JS string and write file', () => {
        runPrettier(outputFile, 'console.log("1");console.log("2");');
        expect(fs.existsSync(outputFile)).toBeTruthy();
        const data = fs.readFileSync(outputFile, 'utf8');
        expect(data).toContain("console.log('1');\n");

        expect(consoleSpy).toHaveBeenCalledTimes(0);
    });

    it('prettier should fail on invalid JS, with file still written', () => {
        runPrettier(outputFile, '"');
        expect(fs.existsSync(outputFile)).toBeTruthy();
        const data = fs.readFileSync(outputFile, 'utf8');
        expect(data).toContain('"');

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toContain('WARNING: Could not apply prettier');
    });
});
