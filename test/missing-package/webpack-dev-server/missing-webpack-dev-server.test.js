'use-strict';
const { run } = require('../../utils/test-utils');
const path = require('path');
const { renameSync } = require('fs');

const pathToPackage = require.resolve('webpack-dev-server').split(path.sep);
const pathToBase = pathToPackage.slice(0, pathToPackage.indexOf('webpack-dev-server'));
const pathToPacakge = (pkg) => {
    return [...pathToBase, pkg].join(path.sep);
};

describe('missing webpack-dev-server', () => {
    beforeAll(() => {
        renameSync(pathToPacakge('webpack-dev-server'), pathToPacakge('.webpack-dev-server'));
    });

    afterAll(() => {
        renameSync(pathToPacakge('.webpack-dev-server'), pathToPacakge('webpack-dev-server'));
    });

    it('should prompt for webpack-dev-server installation upon serve', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve'], false);
        expect(stderr).toContain("you need to install: 'webpack-dev-server'");
        expect(stderr).toContain('Would you like to install');
        expect(exitCode).toBe(0);
        expect(stdout).toBeFalsy();
    });
});
