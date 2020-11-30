'use strict';

const { appendDataIfFileExists, run, runAndGetWatchProc, hyphenToUpperCase } = require('./test-utils');
const { writeFileSync, unlinkSync, readFileSync } = require('fs');
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

describe('run function', () => {
    it('should work correctly by default', () => {
        const { command, stdout, stderr } = run(__dirname);

        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        // Executes the correct command
        expect(command).toContain('cli.js');
        // Should use apply a default output dir
        expect(command).toContain('--output-path');
        expect(command).toContain('bin');
        expect(stdout).toBeTruthy();
    });

    it('executes cli with passed commands and params', () => {
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

    it('uses default output when output param is false', () => {
        const { stdout, stderr, command } = run(__dirname, [], false);

        // execution command contains info command
        expect(command).not.toContain('--output-path');
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});

describe('runAndGetWatchProc function', () => {
    it('should work correctly by default', async () => {
        const { command, stdout, stderr } = await runAndGetWatchProc(__dirname);

        // Executes the correct command
        expect(command).toContain('cli.js');
        // Should use apply a default output dir
        expect(command).toContain('--output-path');
        expect(command).toContain('bin');
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });

    it('executes cli with passed commands and params', async () => {
        const { stdout, stderr, command } = await runAndGetWatchProc(__dirname, ['info', '--output', 'markdown'], false);

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

    it('uses default output when output param is false', async () => {
        const { stdout, stderr, command } = await runAndGetWatchProc(__dirname, [], false);

        // execution command contains info command
        expect(command).not.toContain('--output-path');
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });

    it('writes to stdin', async () => {
        const { stdout } = await runAndGetWatchProc(__dirname, ['init'], false, 'n');

        expect(stdout).toContain('Which will be your application entry point?');
    });
});

describe('hyphenToUpperCase function', () => {
    it('changes value from hypen to upperCase', () => {
        const result = hyphenToUpperCase('test-value');

        expect(result).toEqual('testValue');
    });
});
