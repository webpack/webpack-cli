'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const DOWN = '\x1B\x5B\x42';
const genPath = path.join(__dirname, 'test-assets');

jest.setTimeout(400000);

describe('init with SCSS', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        // rimraf.sync(genPath);
    });

    it('should use SCSS', async () => {
        const { stdout } = await runPromptWithAnswers(
            genPath,
            ['init'],
            [`N${ENTER}`, ENTER, ENTER, ENTER, `${DOWN}${DOWN}${ENTER}`, `Y${ENTER}`, `apple${ENTER}`],
        );

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['./package.json', 'yarn.lock', '.yo-rc.json', 'webpack.config.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(path.join(genPath, file))).toBeTruthy();
        });
    });
});
