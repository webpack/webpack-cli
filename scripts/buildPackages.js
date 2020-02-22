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
