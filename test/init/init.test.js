const { mkdirSync } = require('fs');
const { resolve } = require('path');
const rimraf = require('rimraf');
const { run } = require('../utils/test-utils');

const assetsPath = resolve(__dirname, './test-assets');

describe('init', () => {
    beforeEach(() => {
        mkdirSync(assetsPath);
    });

    afterEach(() => {
        rimraf.sync(assetsPath);
    });

    it('should generate default project when nothing is passed', () => {
        const { stdout, stderr } = run(assetsPath, ['init']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('create src/index.js');
    });
});
