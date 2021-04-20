'use strict';

const { run, runAndGetWatchProc, hyphenToUpperCase } = require('./test-utils');
const { writeFileSync, unlinkSync, mkdirSync } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');

const ENTER = '\x0D';

describe('appendFile', () => {
    describe('positive test-cases', () => {
        const junkFile = 'junkFile.js';
        const junkFilePath = resolve(__dirname, junkFile);
        const initialJunkData = 'initial junk data';

        beforeEach(() => {
            writeFileSync(junkFilePath, initialJunkData);
        });
        afterEach(() => {
            unlinkSync(junkFilePath);
        });
    });
});

describe('run function', () => {
    it('should work correctly by default', async () => {
        const { command, stdout, stderr } = await run(__dirname);

        expect(stderr).toBeFalsy();
        // Executes the correct command
        expect(command).toContain('cli.js');
        expect(command).toContain('bin');
        expect(stdout).toBeTruthy();
    });

    it('executes cli with passed commands and params', async () => {
        const { stdout, stderr, command } = await run(__dirname, ['info', '--output', 'markdown'], false);

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
        const { stdout, stderr, command } = await run(__dirname, [], false);

        // execution command contains info command
        expect(command).not.toContain('--output-path');
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});

describe('runAndGetWatchProc function', () => {
    it('should work correctly by default', async () => {
        const { command, stdout, stderr } = await runAndGetWatchProc(__dirname);

        // Executes the correct command
        expect(command).toContain('cli.js');
        // Should use apply a default output dir
        expect(stderr).toBeFalsy();
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
        const { stdout, stderr } = await runAndGetWatchProc(__dirname, [], false);

        // execution command contains info command
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('writes to stdin', async () => {
        const assetsPath = resolve(__dirname, './test-assets');

        mkdirSync(assetsPath);

        const { stdout } = await runAndGetWatchProc(assetsPath, ['init', '--force', '--template=mango'], ENTER);

        expect(stdout).toContain('Project has been initialised with webpack!');

        rimraf.sync(assetsPath);
    });
});

describe('hyphenToUpperCase function', () => {
    it('changes value from hypen to upperCase', () => {
        const result = hyphenToUpperCase('test-value');

        expect(result).toEqual('testValue');
    });
});
