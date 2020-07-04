const fs = require('fs');
const path = require('path');

const BASE_DIR = 'test/';

function collectTestFolders(strategy) {
    const testFolder = path.resolve(path.join(process.cwd(), BASE_DIR));

    return extractFolder(testFolder, [], strategy);
}

function extractFolder(folderToRead, folders = [], folderStrategy) {
    const files = fs.readdirSync(folderToRead);
    files.forEach((file) => {
        const filePath = path.resolve(path.join(folderToRead, file));
        const stats = fs.statSync(filePath);
        if (folderStrategy(stats, file)) {
            folders.push(folderToRead);
        }
        if (stats.isDirectory() && file !== 'node_modules') {
            extractFolder(filePath, folders, folderStrategy);
        }
    });

    return folders;
}

module.exports = collectTestFolders;
