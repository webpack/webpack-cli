const { run } = require('../../../utils/test-utils');

describe('webpack cli', () => {
    it('should support coffeescript file as flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.coffee']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should load coffeescript file by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
