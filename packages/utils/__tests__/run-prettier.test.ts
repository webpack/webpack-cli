'use strict';

import fs from 'fs';
import path from 'path';
//eslint-disable-next-line node/no-extraneous-import
import rimraf from 'rimraf';
import { runPrettier } from '../src/run-prettier';

const outputPath = path.join(__dirname, 'test-assets');
const outputFile = path.join(outputPath, 'test.js');
const stdoutSpy = jest.spyOn(process.stdout, 'write');

describe('runPrettier', () => {
    beforeEach(() => {
        rimraf.sync(outputPath);
        fs.mkdirSync(outputPath);
        stdoutSpy.mockClear();
    });

    afterAll(() => {
        rimraf.sync(outputPath);
    });

    it('should run prettier on JS string and write file', () => {
        runPrettier(outputFile, 'console.log("1");console.log("2");');
        expect(fs.existsSync(outputFile)).toBeTruthy();
        const data = fs.readFileSync(outputFile, 'utf8');
        expect(data).toContain("console.log('1');\n");

        expect(stdoutSpy.mock.calls.length).toEqual(0);
    });

    it('prettier should fail on invalid JS, with file still written', () => {
        runPrettier(outputFile, '"');
        expect(fs.existsSync(outputFile)).toBeTruthy();
        const data = fs.readFileSync(outputFile, 'utf8');
        expect(data).toContain('"');

        expect(stdoutSpy.mock.calls.length).toEqual(1);
        expect(stdoutSpy.mock.calls[0][0]).toContain('WARNING: Could not apply prettier');
    });
});
