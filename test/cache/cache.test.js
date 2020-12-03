'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { run, isWebpack5 } = require('../utils/test-utils');

describe('cache', () => {
    it('should work', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-test-default-development'));

        let { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false);

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-default' starting...");
            expect(stderr).toContain("Compilation 'cache-test-default' finished");
            expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
            expect(stderr.match(/Stored pack/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }

        ({ exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false));

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-default' starting...");
            expect(stderr).toContain("Compilation 'cache-test-default' finished");
            expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }
    });

    it('should work in multi compiler mode', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-test-{first,second}-development'));

        let { exitCode, stderr, stdout } = run(__dirname, ['-c', './multi.config.js'], false);

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-first' starting...");
            expect(stderr).toContain("Compilation 'cache-test-first' finished");
            expect(stderr).toContain("Compilation 'cache-test-second' starting...");
            expect(stderr).toContain("Compilation 'cache-test-second' finished");
            expect(stderr.match(/No pack exists at/g)).toHaveLength(2);
            expect(stderr.match(/Stored pack/g)).toHaveLength(2);
            expect(stdout).toBeTruthy();
        }

        ({ exitCode, stderr, stdout } = run(__dirname, ['-c', './multi.config.js'], false));

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-first' starting...");
            expect(stderr).toContain("Compilation 'cache-test-first' finished");
            expect(stderr).toContain("Compilation 'cache-test-second' starting...");
            expect(stderr).toContain("Compilation 'cache-test-second' finished");
            expect(stderr.match(/restore cache container:/g)).toHaveLength(2);
            expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(2);
            expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(2);
            expect(stdout).toBeTruthy();
        }
    });

    it('should work in multi compiler mode with the `--config-name` argument', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-test-third-development'));

        let { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', './multi.config.js', '--config-name', 'cache-test-first', '--name', 'cache-test-third'],
            false,
        );

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-third' starting...");
            expect(stderr).toContain("Compilation 'cache-test-third' finished");
            expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
            expect(stderr.match(/Stored pack/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }

        ({ exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', './multi.config.js', '--config-name', 'cache-test-first', '--name', 'cache-test-third'],
            false,
        ));

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-third' starting...");
            expect(stderr).toContain("Compilation 'cache-test-third' finished");
            expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }
    });

    it('should work with the `--merge` argument', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-test-fourth-development'));

        let { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', './multi.config.js', '-c', './webpack.config.js', '--merge', '--name', 'cache-test-fourth'],
            false,
        );

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-fourth' starting...");
            expect(stderr).toContain("Compilation 'cache-test-fourth' finished");
            expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
            expect(stderr.match(/Stored pack/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }

        ({ exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', './multi.config.js', '-c', './webpack.config.js', '--merge', '--name', 'cache-test-fourth'],
            false,
        ));

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-fourth' starting...");
            expect(stderr).toContain("Compilation 'cache-test-fourth' finished");
            expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }
    });

    it('should work with the `--config-name` and `--merge` argument', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-test-fifth-development'));

        let { exitCode, stderr, stdout } = run(
            __dirname,
            [
                '-c',
                './multi.config.js',
                '-c',
                './webpack.config.js',
                '--merge',
                '--config-name',
                'cache-test-first',
                '--config-name',
                'cache-test-second',
                '--name',
                'cache-test-fifth',
            ],
            false,
        );

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-fifth' starting...");
            expect(stderr).toContain("Compilation 'cache-test-fifth' finished");
            expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
            expect(stderr.match(/Stored pack/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }

        ({ exitCode, stderr, stdout } = run(
            __dirname,
            [
                '-c',
                './multi.config.js',
                '-c',
                './webpack.config.js',
                '--merge',
                '--config-name',
                'cache-test-first',
                '--config-name',
                'cache-test-second',
                '--name',
                'cache-test-fifth',
            ],
            false,
        ));

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-fifth' starting...");
            expect(stderr).toContain("Compilation 'cache-test-fifth' finished");
            expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }
    });

    it('should work with autoloading configuration', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-test-autoloading-development'));

        let { exitCode, stderr, stdout } = run(__dirname, ['--name', 'cache-test-autoloading'], false);

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-autoloading' starting...");
            expect(stderr).toContain("Compilation 'cache-test-autoloading' finished");
            expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
            expect(stderr.match(/Stored pack/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }

        ({ exitCode, stderr, stdout } = run(__dirname, ['--name', 'cache-test-autoloading'], false));

        expect(exitCode).toEqual(0);

        if (isWebpack5) {
            expect(stderr).toContain("Compilation 'cache-test-autoloading' starting...");
            expect(stderr).toContain("Compilation 'cache-test-autoloading' finished");
            expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
            expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
            expect(stdout).toBeTruthy();
        }
    });
});
