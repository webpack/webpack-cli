'use-strict';
const { run } = require('../../utils/test-utils');
const path = require('path');
const { renameSync } = require('fs');

const pathToPackage = require.resolve('webpack').split(path.sep);
const pathToBase = pathToPackage.slice(0, pathToPackage.indexOf('webpack'));
const pathToPacakge = (pkg) => {
    return [...pathToBase, pkg].join(path.sep);
};
describe('missing webpack', () => {
    beforeAll(() => {
        renameSync(pathToPacakge('webpack'), pathToPacakge('.webpack'));
    });

    afterAll(() => {
        renameSync(pathToPacakge('.webpack'), pathToPacakge('webpack'));
    });

    it('should prompt for webpack installation', () => {
        const { exitCode, stderr, stdout } = run(__dirname, []);
        expect(stderr).toContain('webpack is not installed');
        expect(stderr).toContain('Would you like to install');
        expect(exitCode).toBe(0);
        expect(stdout).toBeFalsy();
    });
});
