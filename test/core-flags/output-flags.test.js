'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flagsFromCore } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const outputFlags = flagsFromCore.filter(({ name }) => name.startsWith('output-'));

describe('module config related flag', () => {
    outputFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('output-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Boolean) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`]);

                if (flag.name === 'output-module') {
                    //'output.module: true' is only allowed when 'experiments.outputModule' is enabled
                    stdout = run(__dirname, [`--${flag.name}`, '--experiments-output-module']).stdout;
                    expect(stdout).toContain('module: true');
                } else if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            it(`should config --no-${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--no-${flag.name}`]);

                if (flag.name.includes('-reset')) {
                    const option = propName.split('Reset')[0];
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: false`);
                }
            });
        }

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.type === String) {
            it(`should config --${flag.name} correctly`, () => {
                let { stderr, stdout } = run(__dirname, [`--${flag.name}`, 'test']);

                if (flag.name === 'output-cross-origin-loading') {
                    stdout = run(__dirname, [`--${flag.name}`, 'anonymous']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'anonymous'`);
                } else if (flag.name === 'output-enabled-library-type') {
                    stdout = run(__dirname, [`--${flag.name}`, 'amd']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'amd'`);
                } else if (flag.name === 'output-hash-function') {
                    stdout = run(__dirname, [`--${flag.name}`, 'sha256']).stdout;
                    stderr = run(__dirname, [`--${flag.name}`, 'sha256']).stderr;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`hashFunction: 'sha256'`);
                } else if (flag.name === 'output-script-type') {
                    stdout = run(__dirname, [`--${flag.name}`, 'module']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'module'`);
                } else if (flag.name === 'output-enabled-library-types') {
                    stdout = run(__dirname, [`--${flag.name}`, 'var']).stdout;

                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'var' ]`);
                } else if (flag.name === 'output-path') {
                    expect(stdout).toContain('test');
                } else {
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'test'`);
                }
            });
        }
    });
});
