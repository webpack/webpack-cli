'use strict';

const { runWatch, isWebpack5 } = require('../../utils/test-utils');

describe('stats and watch', () => {
    it('should not log stats with the "none" value from the configuration', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['-c', './webpack.config.js', '--color']);

        expect(stdout).toContain('[webpack-cli] [32mCompilation starting...[39m');
        expect(stdout).toContain('[webpack-cli] [32mCompilation finished[39m');
        expect(stdout).toContain('[webpack-cli] [32mwatching files for updates...[39m');
        expect(stderr).toBeFalsy();
    });

    it('should not log stats with the "none" value from the configuration and multi compiler mode', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['-c', './multi-webpack.config.js', '--color']);

        expect(stdout).toContain('[webpack-cli] [32mCompilation starting...[39m');
        expect(stdout).toContain('[webpack-cli] [32mCompilation finished[39m');
        expect(stdout).toContain('[webpack-cli] [32mwatching files for updates...[39m');
        expect(stderr).toBeFalsy();
    });

    it('should log stats with the "normal" value in arguments', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ['-c', './webpack.config.js', '--stats', 'normal', '--color']);

        const output = isWebpack5 ? 'successfully' : 'main.js';

        expect(stdout).toContain('[webpack-cli] [32mCompilation starting...[39m');
        expect(stdout).toContain('[webpack-cli] [32mCompilation finished[39m');
        expect(stdout).toContain('[webpack-cli] [32mwatching files for updates...[39m');
        expect(stdout).toContain(output);
        expect(stderr).toBeFalsy();
    });
});
