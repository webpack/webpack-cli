'use strict';

const { run } = require('../../utils/test-utils');
const testData = ['##########', 'building', 'Compilation completed'];

describe('progress display test', () => {
    it('should display progress bar through flag', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.config.js', '--progress']);
        expect(stderr).toBeFalsy();
        testData.forEach((test) => {
            expect(stdout).toContain(test);
        });
    });

    it('should accept Object config', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.singleConfig.js']);
        expect(stderr).toBeFalsy();
        testData.forEach((test) => {
            expect(stdout).toContain(test);
        });
    });

    it('should accept Array config, multiple config', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.multi.js']);
        expect(stderr).toBeFalsy();
        testData.forEach((test) => {
            expect(stdout).toContain(test);
        });
    });

    it('should override the config when progress flag is given', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.singleConfig.js', '--progress']);
        expect(stderr).toBeFalsy();
        testData.forEach((test) => {
            expect(stdout).toContain(test);
        });
    });
});
