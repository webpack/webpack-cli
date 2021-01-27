'use strict';

const stripAnsi = require('strip-ansi');
const { run, runAndGetWatchProc, isWebpack5 } = require('../../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('basic', () => {
    it('should work with negative value', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', './watch.config.js', '--no-watch']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should recompile upon file change using the `--watch` option', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--mode', 'development'], false, '', true);

        let modified = false;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('index.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                    });

                    modified = true;
                } else {
                    proc.kill();
                    done();
                }
            }
        });
    });

    it('should recompile upon file change using the `watch` command', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['watch', '--mode', 'development'], false, '', true);

        let modified = false;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('index.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                    });

                    modified = true;
                } else {
                    proc.kill();
                    done();
                }
            }
        });
    });

    it('should recompile upon file change using the `watch` command and entries syntax', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['watch', './src/entry.js', '--mode', 'development'], false, '', true);

        let modified = false;

        const wordsInStatsv5Entries = ['asset', 'entry.js', 'compiled successfully'];

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('entry.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5Entries) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(resolve(__dirname, './src/entry.js'), `console.log('watch flag test');`);
                    });

                    modified = true;
                } else {
                    proc.kill();
                    done();
                }
            }
        });
    });

    it('should recompile upon file change using the `command` option and the `--watch` option and log warning', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['watch', '--watch', '--mode', 'development'], false, '', true);

        let modified = false;
        let hasWarning = false;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('index.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified && !hasWarning) {
                    process.nextTick(() => {
                        writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                    });

                    modified = true;
                } else {
                    proc.kill();
                    done();
                }
            }
        });

        proc.stderr.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            hasWarning = true;

            expect(data).toContain("No need to use the '--watch, -w' option together with the 'watch' command, it does not make sense");
        });
    });

    it('should recompile upon file change using the `command` option and the `--no-watch` option and log warning', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['watch', '--no-watch', '--mode', 'development'], false, '', true);

        let modified = false;
        let hasWarning = false;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('index.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified && !hasWarning) {
                    process.nextTick(() => {
                        writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                    });

                    modified = true;
                } else {
                    proc.kill();
                    done();
                }
            }
        });

        proc.stderr.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            hasWarning = true;

            expect(data).toContain("No need to use the '--no-watch' option together with the 'watch' command, it does not make sense");
        });
    });
});
