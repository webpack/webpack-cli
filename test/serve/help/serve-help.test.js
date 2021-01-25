const { runServe, isWebpack5 } = require('../../utils/test-utils');

const usageText = 'webpack serve|s [entries...] [options]';
const descriptionText = 'Run the webpack dev server';

describe('serve help', () => {
    it('should log help information', async () => {
        const { stderr, stdout, exitCode } = await runServe(__dirname, ['--help']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(descriptionText);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Options:');
        // Serve flags are rendered
        expect(stdout).toContain('--liveReload');
        expect(stdout).toContain('--https');
        expect(stdout).toContain('--open [value]');
    });

    it('should log help information using "verbose"', async () => {
        const { stderr, stdout, exitCode } = await runServe(__dirname, ['--help', 'verbose']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(descriptionText);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain('Options:');

        if (isWebpack5) {
            expect(stdout).toContain('--cache-type');
        }
    });

    it('should log help information and respect the "--no-color" option', async () => {
        const { stdout, stderr } = await runServe(__dirname, ['--help', '--no-color']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
    });
});
