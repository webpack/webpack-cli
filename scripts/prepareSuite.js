'use strict';

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const execa = require('execa');
// eslint-disable-next-line node/no-unpublished-require
const chalk = require('chalk');

const BASE_DIR = 'test/';
const PACKAGE = 'package.json';

function collectTestingFoldersWithPackage() {
    const testFolder = path.resolve(path.join(process.cwd(), BASE_DIR));

    return extractFolder(testFolder);
}

function extractFolder(folderToRead, folders = []) {
    const files = fs.readdirSync(folderToRead);

    files.forEach((file) => {
        const filePath = path.resolve(path.join(folderToRead, file));
        const stats = fs.statSync(filePath);
        if (stats.isFile() && file === PACKAGE) {
            folders.push(folderToRead);
        }
        if (stats.isDirectory() && file !== 'node_modules') {
            extractFolder(filePath, folders);
        }
    });

    return folders;
}

(async () => {
    try {
        const folders = collectTestingFoldersWithPackage();
        for (const folder of folders) {
            await execa('yarn', {
                cwd: folder,
                stdio: 'inherit',
            });
        }
        console.log(chalk.inverse.green(' Successfully prepared the test suite '));
    } catch (e) {
        console.error(chalk.inverse.red(' Unable to prepare the test suite '));
        console.error(e.stack);
        process.exitCode = 1;
    }
})();
