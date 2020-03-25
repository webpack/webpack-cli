'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../utils/test-utils');
const parseArgs = require('../../packages/webpack-cli/lib/utils/parse-args');

describe('node flags', () => {
    it('parseArgs helper must work correctly', () => {
        [
            {
                rawArgs: ['--foo', '--bar', '--baz=quux'],
                expectedCliArgs: ['--foo', '--bar', '--baz=quux'],
                expectedNodeArgs: [],
            },
            {
                rawArgs: ['--foo', '--bar', '--baz=quux', '--node-args', '--name1=value1', '--node-args', '--name2 value2'],
                expectedCliArgs: ['--foo', '--bar', '--baz=quux'],
                expectedNodeArgs: ['--name1=value1', '--name2', 'value2'],
            },
            {
                rawArgs: [
                    '--node-args',
                    '--name1=value1',
                    '--node-args',
                    '--name2="value2"',
                    '--node-args',
                    '--name3 value3',
                    '--node-args',
                    '-k v',
                ],
                expectedCliArgs: [],
                expectedNodeArgs: ['--name1=value1', '--name2="value2"', '--name3', 'value3', '-k', 'v'],
            },
        ].map(({ rawArgs, expectedNodeArgs, expectedCliArgs }) => {
            const { nodeArgs, cliArgs } = parseArgs(rawArgs);
            expect(nodeArgs).toEqual(expectedNodeArgs);
            expect(cliArgs).toEqual(expectedCliArgs);
        });
    });

    it.skip('is able to pass the options flags to node js', done => {
        const { stdout } = run(
            __dirname,
            [
                '--node-args',
                `--require=${resolve(__dirname, 'bootstrap.js')}`,
                '--node-args',
                `-r ${resolve(__dirname, 'bootstrap2.js')}`,
                '--output',
                './bin/[name].bundle.js',
            ],
            false,
        );
        expect(stdout).toContain('---from bootstrap.js---');
        expect(stdout).toContain('---from bootstrap2.js---');
        stat(resolve(__dirname, './bin/main.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('throws an error on supplying unknown flags', () => {
        const { stderr } = run(__dirname, ['--node-args', '--unknown']);
        expect(stderr).toContain('node: bad option:');
    });

    it('throws an error if no values were supplied with --max-old-space-size', () => {
        const { stderr, stdout } = run(__dirname, ['--node-args', '--max-old-space-size']);
        expect(stderr).toBeTruthy();
        expect(stdout).toBeFalsy();
    });

    it('throws an error if an illegal value was supplied with --max-old-space-size', () => {
        const { stderr, stdout } = run(__dirname, ['--node-args', '--max-old-space-size=1024a']);
        expect(stderr).toBeTruthy();
        expect(stdout).toBeFalsy();
    });
});
