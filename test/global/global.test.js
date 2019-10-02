'use strict';

const path = require('path');
const execa = require('execa');
const { sync: spawnSync } = execa;

const { run } = require('../utils/test-utils');

describe('global flag', () => {
    it('warns if there are no arguments to flag', () => {
        const { stderr } = run(__dirname, ['--global']);
        expect(stderr).toContain('Argument to global flag is none');
    });

    it('warns if there are no value for key', () => {
        const { stderr } = run(__dirname, ['--global', 'myVar']);
        expect(stderr).toContain('Argument to global flag expected a key/value pair');
    });

    it('is able inject one variable to global scope', () => {
        const { stderr } = run(__dirname, ['--global', 'myVar', './global1.js']);
        expect(stderr).toBe('');
        const executable = path.join(__dirname, './bin/bundle.js');
        const bundledScript = spawnSync('node', [executable]);
        expect(bundledScript.stdout).toEqual('myVar ./global1.js');
    });

    it('is able inject multiple variables to global scope', () => {
        const { stderr } = run(__dirname, ['--global', 'myVar', './global1.js', '--global', 'myVar2', './global2.js']);
        expect(stderr).toBe('');
        const executable = path.join(__dirname, './bin/bundle.js');
        const bundledScript = spawnSync('node', [executable]);
        expect(bundledScript.stdout).toEqual('myVar ./global1.js\nmyVar ./global2.js');
    });

    it('understands = syntax', () => {
        const { stderr } = run(__dirname, ['--global', 'myVar', './global1.js', '--global', 'myVar2=./global2.js']);
        expect(stderr).toBe('');
        const executable = path.join(__dirname, './bin/bundle.js');
        const bundledScript = spawnSync('node', [executable]);
        expect(bundledScript.stdout).toEqual('myVar ./global1.js\nmyVar ./global2.js');
    });

    it('warns on multiple flags that are inconsistent', () => {
        const result = run(__dirname, ['--global', 'myVar', './global1.js', '--global', 'myVar2']);
        // eslint-disable-next-line
        expect(result.stderr).toContain("Found unmatching value for global flag key 'myVar2'");

        const result2 = run(__dirname, ['--global', 'myVar', './global1.js', '--global', 'myVar2=']);
        // eslint-disable-next-line
        expect(result2.stderr).toContain("Found unmatching value for global flag key 'myVar2'");
    });
});
