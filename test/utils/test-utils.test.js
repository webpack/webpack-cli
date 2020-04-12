'use strict';

const { appendDataIfFileExists, copyFile, run } = require('./test-utils');
const { writeFileSync, unlinkSync, readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

describe('appendFile', () => {
    describe('positive test-cases', () => {
        const junkFile = 'junkFile.js';
        const junkFilePath = resolve(__dirname, junkFile);
        const initialJunkData = 'initial junk data';
        const junkComment = '//junk comment';

        beforeEach(() => {
            writeFileSync(junkFilePath, initialJunkData);
        });
        afterEach(() => {
            unlinkSync(junkFilePath);
        });
        it('should append data to file if file exists', () => {
            appendDataIfFileExists(__dirname, junkFile, junkComment);
            const actualData = readFileSync(junkFilePath).toString();

            expect(actualData).toBe(initialJunkData + junkComment);
        });
    });

    describe('negative test-cases', () => {
        it('should throw error if file does not exist', () => {
            expect(() => appendDataIfFileExists(__dirname, 'does-not-exist.js', 'junk data')).toThrowError();
        });
    });
});

describe('copyFile', () => {
    describe('positive test-cases', () => {
        const originalFile = 'junkFile.js';
        const originalFilePath = resolve(__dirname, originalFile);
        const originalFileData = 'initial junk data';
        let copyFilePath;

        beforeEach(() => {
            writeFileSync(originalFilePath, originalFileData);
        });
        afterEach(() => {
            unlinkSync(originalFilePath);
            if (existsSync(copyFilePath)) {
                unlinkSync(copyFilePath);
            }
        });
        it('should copy file if file exists', () => {
            copyFilePath = copyFile(__dirname, originalFile);
            const actualData = readFileSync(copyFilePath).toString();

            expect(actualData).toBe(originalFileData);
        });
    });

    describe('negative test-cases', () => {
        it('should throw error if file does not exist', () => {
            expect(() => copyFile(__dirname, 'does-not-exist.js')).toThrowError();
        });
    });
});

describe('Runs webpack CLI for a test case correctly', () => {
    it('Run function works correctly', () => {
        const { command, stdout, stderr } = run(__dirname);
        // Executes the correct command
        expect(command).toContain('/webpack-cli/bin/cli.js');
        // Should use apply a default output dir
        expect(command).toContain('--output');
        expect(command).toContain('/webpack-cli/test/utils/bin');
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
    });

    it('Run function executes cli with passed commands and params', () => {
        const { stdout, stderr, command } = run(__dirname, ['info', '--output', 'markdown'], false);
        // execution command contains info command
        expect(command).toContain('info');
        expect(command).toContain('--output markdown');

        // Contains info command output
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Node');
        expect(stdout).toContain('npm');
        expect(stdout).toContain('Yarn');
        expect(stderr).toBeFalsy();
    });

    it('Run function uses default output when output param is false', () => {
        const { stdout, stderr, command } = run(__dirname, [], false);
        // execution command contains info command
        expect(command).not.toContain('--output');
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
    });
});
