'use strict';
const { runAndGetWatchProc, isWebpack5 } = require('../../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const { version } = require('webpack');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled', 'webpack'];
const clear = '\x1B[2J\x1B[3J\x1B[H';

describe('--interactive flag with multi compiler', () => {
    it('should output in interactive with --interactive', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u2B24');
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
                    if (version.startsWith('5')) {
                        return data.includes(wordsInStatsv5[0]);
                    } else {
                        return data.includes(wordsInStatsv4[0]);
                    }
                },
                perform: (data) => {
                    if (version.startsWith('5')) {
                        for (const word of wordsInStatsv5) {
                            expect(data).toContain(word);
                        }
                    } else {
                        for (const word of wordsInStatsv4) {
                            expect(data).toContain(word);
                        }
                    }
                },
            },
        ];

        let semaphore = 0;
        proc.stdout.on('readable', () => {
            if (semaphore >= checker.length) {
                proc.kill();
                done();
                return;
            }

            let data = '';
            let chunk;
            while ((chunk = proc.stdout.read())) {
                data += chunk.toString();
            }

            if (data && checker[semaphore].check(data.toString())) {
                try {
                    checker[semaphore].perform(data.toString());
                    semaphore++;
                } catch (err) {
                    proc.kill();
                    done(err);
                }
            }
        });
    });

    it('should output in interactive and on s', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u2B24');
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
                    if (!isWebpack5) {
                        return data.includes('stoping');
                    }
                    return data.includes('stoped');
                },
                perform: (data) => {
                    if (!isWebpack5) {
                        expect(data).toContain('stoping');
                        return;
                    }
                    expect(data).toContain('stoped');
                },
            },
        ];

        let semaphore = 0;
        proc.stdout.on('readable', () => {
            if (semaphore >= checker.length) {
                proc.kill();
                done();
                return;
            }

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
    });

    it('should should start watching on w after stoping with s', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        const checker = [
            {
                check: (data) => {
                    return data.includes('\u2B24');
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
                    if (!isWebpack5) {
                        return data.includes('stoping');
                    }
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
                    if (!isWebpack5) {
                        return data.includes('starting not supported');
                    } else {
                        return data.includes('all compilations completed');
                    }
                },
                perform: (data) => {
                    if (!isWebpack5) {
                        expect(data).toContain('starting not supported');
                    } else {
                        expect(data).toContain('all compilations completed');
                    }
                },
            },
        ];

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
    });
});
