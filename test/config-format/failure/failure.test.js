const path = require('path');

const { run } = require('../../utils/test-utils');

describe('webpack cli', () => {
    it('should support mjs config format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.coffee']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Unable load '${path.resolve(__dirname, './webpack.config.coffee')}'`);
        expect(stderr).toContain('Unable to use specified module loaders for ".coffee".');
        expect(stderr).toContain("Cannot find module 'coffeescript/register'");
        expect(stderr).toContain("Cannot find module 'coffee-script/register'");
        expect(stderr).toContain("Cannot find module 'coffeescript'");
        expect(stderr).toContain("Cannot find module 'coffee-script'");
        expect(stderr).toContain('Please install one of them');
        expect(stdout).toBeFalsy();
    });
});
