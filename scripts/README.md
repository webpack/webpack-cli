# scripts

This directory contains javascripts file to build and prepare packages.

## buildPackages.js

```javascript
'use strict';

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const execa = require('execa');
// eslint-disable-next-line node/no-unpublished-require
const chalk = require('chalk');

const PACKAGES_DIR = path.resolve(__dirname, '../packages');

function getPackages() {
    return fs
        .readdirSync(PACKAGES_DIR)
        .map(file => path.resolve(PACKAGES_DIR, file))
        .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

const packages = getPackages();

const packagesWithTs = packages.filter(p => fs.existsSync(path.resolve(p, 'tsconfig.json')));

const args = ['tsc', '-b', ...packagesWithTs, ...process.argv.slice(2)];

try {
    execa.sync('yarn', args, { stdio: 'inherit' });
    console.log(chalk.inverse.green(' Successfully built TypeScript definition files '));
} catch (e) {
    console.error(chalk.inverse.red(' Unable to build TypeScript definition files '));
    console.error(e.stack);
    process.exitCode = 1;
}
```

## prepareSuite.js

```javascript
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

    files.forEach(file => {
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

{
    Promise.all(
        collectTestingFoldersWithPackage().map(async folder => {
            return execa('yarn', {
                cwd: folder,
                stdio: 'inherit',
            });
        }),
    )
        .then(() => {
            console.log(chalk.inverse.green(' Successfully prepared the test suite '));
        })
        .catch(e => {
            console.error(chalk.inverse.red(' Unable to prepare the test suite '));
            console.error(e.stack);
            process.exitCode = 1;
        });
}
```
