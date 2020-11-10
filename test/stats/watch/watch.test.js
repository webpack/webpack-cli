'use strict';

const { runWatch, isWebpack5 } = require('../../utils/test-utils');

describe('stats and watch', () => {
    it('should not log stats with the "none" value from the configuration', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['-c', './webpack.config.js']);

        expect(stdout).toContain('[webpack-cli] Compilation starting...');
        expect(stdout).toContain('[webpack-cli] Compilation finished');
        expect(stdout).toContain('[webpack-cli] watching files for updates...');
        expect(stderr).toBeFalsy();
    });

    it('should not log stats with the "none" value from the configuration and multi compiler mode', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['-c', './multi-webpack.config.js']);

        expect(stdout).toContain('[webpack-cli] Compilation starting...');
        expect(stdout).toContain('[webpack-cli] Compilation finished');
        expect(stdout).toContain('[webpack-cli] watching files for updates...');
        expect(stderr).toBeFalsy();
    });

    it('should log stats with the "normal" value in arguments', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['-c', './webpack.config.js', '--stats', 'normal']);

        const output = isWebpack5 ? 'successfully' : 'main.js';

        expect(stdout).toContain('[webpack-cli] Compilation starting...');
        expect(stdout).toContain('[webpack-cli] Compilation finished');
        expect(stdout).toContain(output);
        expect(stdout).toContain('[webpack-cli] watching files for updates...');
        expect(stderr).toBeFalsy();
    });
});
