// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');
const { collectTestFolders } = require('./utils');

const outputDirectories = ['bin', 'binary', 'dist'];

function folderStrategy(stats, file) {
    return stats.isDirectory() && outputDirectories.includes(file);
}

function cleanupOutputDirs() {
    for (const outputFolder of collectTestFolders(folderStrategy)) {
        rimraf.sync(outputFolder);
    }
}

module.exports = cleanupOutputDirs;
