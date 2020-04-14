/* eslint-disable node/no-unpublished-require */
'use strict';

const fs = require('fs');
const path = require('path');
const { runInitWithAnswers } = require('../../../../../test/utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';

jest.setTimeout(200000);

describe('init', () => {
    it('should scaffold when given answers', async () => {
        const stdout = await runInitWithAnswers(__dirname, ['N', ENTER, ENTER, ENTER, ENTER, ENTER, ENTER, ENTER]);

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        console.log(stdout);
        console.log(fs.readdirSync(__dirname));

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './yarn.lock', './src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            console.log(file); // Debug comment
            expect(fs.existsSync(path.join(__dirname, file))).toBeTruthy();
        });
    });
});
