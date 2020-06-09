'use strict';

const { run } = require('../test-utils');

describe('webpack-cli-test-plugin Test', () => {
    it('should log the webpack configuration', () => {
        const { stderr, stdout } = run(__dirname);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`target: 'node'`);
        expect(stdout).toContain('plugins: [ WebpackCLITestPlugin {} ]');
    });
});
