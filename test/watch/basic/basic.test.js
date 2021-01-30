'use strict';

const stripAnsi = require('strip-ansi');
const { run, runAndGetWatchProc, isWebpack5 } = require('../../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Built at:', 'main.js'];
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

    it('should log warning about the `watch` option in the configuration and recompile upon file change using the `watch` command', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--mode', 'development', '--config', './watch.config.js'], false, '', true);

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

        proc.stderr.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            expect(data).toContain(
                "No need to use the 'watch' command together with '{ watch: true }' configuration, it does not make sense.",
            );
        });
    });

    it('should recompile upon file change using the `command` option and the `--watch` option and log warning', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['watch', '--watch', '--mode', 'development']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--watch'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should recompile upon file change using the `command` option and the `--no-watch` option and log warning', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['watch', '--no-watch', '--mode', 'development']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--no-watch'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });
});
