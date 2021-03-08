const { version } = require('webpack');
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');
const { join } = require('path');
const collectTestFolders = require('./utils');

// Cleanup obsolete snapshots for non-relevant webpack version
const isWebpack5 = version[0] === '5';

const snapshotDirs = ['help'].map(() => `__snapshots-v${isWebpack5 ? '4' : version[0]}__`);

const folderStrategy = (stats, file) => {
    return stats.isDirectory() && snapshotDirs.includes(file);
};

const cleanupOutputDirs = () => {
    for (const outputFolder of collectTestFolders(folderStrategy)) {
        snapshotDirs.forEach((dir) => rimraf.sync(join(outputFolder, dir)));
    }
};

module.exports = () => {
    cleanupOutputDirs();
    console.log(`\n Running tests for webpack @${version} \n`);
};
