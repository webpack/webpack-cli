'use strict';
const { run, runAndGetWatchProc, isWebpack5 } = require('../../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv5 = ['asset', 'index.js', 'compiled', 'webpack'];
const clear = '\x1B[2J\x1B[3J\x1B[H';

const runTest = (proc, checker, done) => {
    let semaphore = 0;
    proc.stdout.on('readable', () => {
        if (semaphore >= checker.length) {
            proc.kill();
            done();
            return;
        }

        // Construct chunk
        let data = '';
        let chunk;
        while ((chunk = proc.stdout.read())) {
            data += chunk.toString();
        }

        if (data && checker[semaphore].check(data)) {
            try {
                checker[semaphore].perform(data);
                semaphore++;
            } catch (err) {
                proc.kill();
                done(err);
            }

            if (semaphore >= checker.length) {
                proc.kill();
                done();
            }
        }
    });

    proc.on('error', (error) => {
        done(error);
        proc.kill();
    });

    proc.on('exit', () => {
        proc.kill();
        done();
    });
};

describe('--interactive flag with multi compiler', () => {
    // webpack v4 should not be supported https://github.com/webpack/webpack-cli/pull/1796#pullrequestreview-605767369
    if (!isWebpack5) {
        it('should throw error upon --interactive', async () => {
            const { stdout, stderr, exitCode } = await run(__dirname, ['--interactive']);
            expect(stdout).toBeFalsy();
            expect(stderr).toContain('Interactive is not supported on webpack v4 and less');
            expect(exitCode).toBe(1);
        });
        return;
    }
    it('should output in interactive with --interactive', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u25B2');
                },
                perform: () => {
                    writeFileSync(resolve(__dirname, './src/index.js'), `console.log('I am Batman');`);
                },
            },
            {
                check: (data) => {
                    return data.includes(clear);
                },
                perform: (data) => {
                    expect(data).toContain(clear);
                },
            },
            {
                check: (data) => {
                    return data.includes(wordsInStatsv5[0]);
                },
                perform: (data) => {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                },
            },
        ];

        runTest(proc, checker, done);
    });

    it('should stop watching on s', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u25B2');
                },
                perform: () => {
                    proc.stdin.write('s\n', (err) => {
                        if (err) {
                            proc.kill();
                            done(err);
                            return;
                        }
                    });
                },
            },
            {
                check: (data) => {
                    return data.includes('stoped');
                },
                perform: (data) => {
                    expect(data).toContain('stoped');
                },
            },
        ];

        runTest(proc, checker, done);
    });

    it('should should start watching on w after stoping with s', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u25B2');
                },
                perform: () => {
                    proc.stdin.write('s\n', (err) => {
                        if (err) {
                            proc.kill();
                            done(err);
                            return;
                        }
                    });
                },
            },
            {
                check: (data) => {
                    return data.includes('stoped');
                },
                perform: (data) => {
                    if (!isWebpack5) {
                        expect(data).toContain('stoping');
                    } else {
                        expect(data).toContain('stoped');
                    }
                    proc.stdin.write('w\n', (err) => {
                        if (err) {
                            proc.kill();
                            done(err);
                            return;
                        }
                    });
                },
            },
            {
                check: (data) => {
                    return data.includes('all compilations completed');
                },
                perform: (data) => {
                    expect(data).toContain('all compilations completed');
                },
            },
        ];

        runTest(proc, checker, done);
    });

    it('should quit in pressing q', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u25B2');
                },
                perform: () => {
                    proc.stdin.write('q\n', (err) => {
                        if (err) {
                            proc.kill();
                            done(err);
                            return;
                        }
                    });
                },
            },
        ];

        const doneCallback = (error) => {
            expect(error).toBeFalsy();
            done();
        };

        runTest(proc, checker, doneCallback);
    });
});
