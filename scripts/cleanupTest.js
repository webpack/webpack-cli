// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');
const { join } = require('path');
const collectTestFolders = require('./utils');

const outputDirectories = ['bin', 'binary', 'dist', 'lib', 'test', 'test-assets', 'test-plugin', 'test-loader', 'stats.json'];

const folderStrategy = (stats, file) => {
    return stats.isDirectory() && outputDirectories.includes(file);
};

const cleanupOutputDirs = () => {
    for (const outputFolder of collectTestFolders(folderStrategy)) {
        outputDirectories.forEach((dir) => rimraf.sync(join(outputFolder, dir)));
    }
};

module.exports = cleanupOutputDirs;
