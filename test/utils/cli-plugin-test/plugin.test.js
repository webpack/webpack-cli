'use strict';
const { cli } = require('webpack');
const { run } = require('../test-utils');

describe('webpack-cli-test-plugin Test', () => {
    it('should log the webpack configuration', () => {
        const { stdout } = run(__dirname);

        expect(stdout).toContain(`target: 'node'`);
        if (typeof cli !== 'undefined') {
            expect(stdout).toContain(`alias: { alias: [ 'alias1', 'alias2' ] }`);
        }
        expect(stdout).toContain(`  WebpackCLITestPlugin { opts: [Array], showAll: true }`);
    });
});
