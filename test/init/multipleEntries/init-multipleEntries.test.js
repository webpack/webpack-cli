'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const genPath = path.join(__dirname, 'test-assets');

describe('init with multiple entries', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        rimraf.sync(genPath);
    });

    it('should scaffold with multiple entries', async () => {
        const { stdout } = await runPromptWithAnswers(
            genPath,
            ['init'],
            [`Y${ENTER}`, `a, b${ENTER}`, ENTER, ENTER, ENTER, ENTER, ENTER, ENTER],
        );

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(path.resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './src/a.js', './src/b.js', './.yo-rc.json'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(path.resolve(genPath, file))).toBeTruthy();
        });
    });
});
