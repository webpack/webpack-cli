'use strict';

const fs = require('fs');
const { join } = require('path');

const { run } = require('../../utils/test-utils');

describe('merge flag configuration', () => {
    it('Fallback to base config if the merge config is not present', () => {
        // 2.js doesn't exist, let's try merging with it
        const { stdout, stderr } = run(__dirname, ['--config', './1.js', '--merge', './2.js'], false);

        expect(stdout).toBeTruthy();

        // User is notified about the fallback
        expect(stderr).toContain(
            `[webpack-cli] The supplied merge config doesn't exist. Falling back to webpack.base.js as default merge config`,
        );
        // Should use webpack.base.js as default merge config
        expect(fs.existsSync(join(__dirname, './dist/merged.js'))).toBeTruthy();
    });
});
