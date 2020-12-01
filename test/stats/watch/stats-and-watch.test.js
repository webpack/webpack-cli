'use strict';

const { runWatch } = require('../../utils/test-utils');

// const output = isWebpack5 ? 'successfully' : 'main.js';

describe('stats and watch', () => {
    it('should not log stats with the "none" value from the configuration', async () => {
        const { stderr } = await runWatch(__dirname, ['-c', './webpack.config.js', '--color']);

        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compiler is watching files for updates...');
        // expect(stdout).toContain(output);
    });

    it('should not log stats with the "none" value from the configuration and multi compiler mode', async () => {
        const { stderr } = await runWatch(__dirname, ['-c', './multi-webpack.config.js', '--color']);

        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compiler is watching files for updates...');
        // expect(stdout).toContain(output);
    });

    it('should log stats with the "normal" value in arguments', async () => {
        const { stderr } = await runWatch(__dirname, ['-c', './webpack.config.js', '--stats', 'normal', '--color']);

        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain('Compiler is watching files for updates...');
        // expect(stdout).toContain(output);
    });
});
