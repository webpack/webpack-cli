'use strict';

jest.setTimeout(10e6);

const { renameSync, unlinkSync } = require('fs');
const { resolve } = require('path');
const { appendDataIfFileExists, runAndGetWatchProc, copyFile } = require('../../test/utils/test-utils');

const testEntryFiles = [
    {
        name: 'index.js',
        fp: resolve(__dirname, 'index.js'),
        cpFp: null,
    },
    {
        name: 'dev.js',
        fp: resolve(__dirname, 'dev.js'),
        cpFp: null,
    },
    {
        name: 'prod.js',
        fp: resolve(__dirname, 'prod.js'),
        cpFP: null,
    },
];

describe('watch config', () => {
    beforeAll(() => {
        // create copy of 'name.js' => 'name_copy.js'
        testEntryFiles.forEach(file => {
            file.cpFP = copyFile(__dirname, file.name);
        });
    });
    afterAll(() => {
        testEntryFiles.forEach(file => {
            try {
                unlinkSync(file.fp);
            } catch (e) {
                console.warn('could not remove the file:' + file.fp + '\n' + e.message);
            } finally {
                renameSync(file.cpFP, file.fp);
            }
        });
    });

    it('should run watch and recompile', done => {
        const startTime = new Date();
        const webpackProc = runAndGetWatchProc(__dirname, ['--watch']);

        const dataBuffer = [];
        webpackProc.stdout.on('data', data => {
            data = data.toString();
            if (data.includes('Built')) {
                let formattedData = data;
                if (data.includes('\u001b')) {
                    formattedData = data.slice(data.indexOf('Built'), data.indexOf('\u001b'));
                }
                dataBuffer.push(formattedData);
            }

            const delta = (new Date().getTime() - startTime.getTime()) / 1000;
            if (delta > 5.0 || (dataBuffer.length && dataBuffer.length > 2)) {
                webpackProc.kill();
                return;
            }
            appendDataIfFileExists(__dirname, testEntryFiles[0].name, '//junk-comment');
        });

        webpackProc.stderr.on('close', () => {
            expect(dataBuffer.length).toBeGreaterThan(1);
            done();
        });
    });

    it('should run watch and recompile with arrays', done => {
        const startTime = new Date();
        const webpackProc = runAndGetWatchProc(__dirname, ['--watch', '--config', './webpack.array.config.js']);

        const dataBuffer = [];
        webpackProc.stdout.on('data', data => {
            data = data.toString();
            if (data.includes('Output Directory')) {
                let formattedData = data;
                if (data.includes('\u001b')) {
                    formattedData = data.slice(data.indexOf('Output Directory'), data.indexOf('\u001b'));
                }
                dataBuffer.push(formattedData);
            }

            const delta = (new Date().getTime() - startTime.getTime()) / 1000;
            if (delta > 5 || (dataBuffer.length && dataBuffer.length > 3)) {
                webpackProc.kill();
                return;
            }
            appendDataIfFileExists(__dirname, testEntryFiles[1].name, '//junk-comment');
            appendDataIfFileExists(__dirname, testEntryFiles[2].name, '//junk2-comment');
        });

        webpackProc.stderr.on('close', () => {
            expect(dataBuffer.length).toBeGreaterThan(3);
            const nCompilationBufferOne = [];
            const nCompilationBufferTwo = [];
            dataBuffer.forEach(chunk => {
                const outputDirStr = chunk.indexOf('Output Directory');
                const outputDirChunk = chunk.slice(outputDirStr).trim('\n');

                const isInArr = nCompilationBufferOne.find(s => s === outputDirChunk);
                if (isInArr || !nCompilationBufferOne.length) {
                    nCompilationBufferOne.push(outputDirChunk);
                    return;
                }
                nCompilationBufferTwo.push(outputDirChunk);
            });
            expect(nCompilationBufferOne.length).toBeGreaterThan(1);
            expect(nCompilationBufferTwo.length).toBeGreaterThan(1);
            expect(nCompilationBufferOne[1]).not.toBe(nCompilationBufferTwo[1]);
            expect(nCompilationBufferOne.length).toEqual(nCompilationBufferTwo.length);
            done();
        });
    });
});
