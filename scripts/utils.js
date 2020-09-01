const fs = require('fs');
const path = require('path');

const BASE_DIR = 'test/';

function collectTestFolders(strategy) {
    const testFolder = path.resolve(path.join(process.cwd(), BASE_DIR));

    return extractFolder(testFolder, [], strategy);
}

async function extractFolder(folderToRead, folders = [], folderStrategy) {
    const files;

    try{
    files = await fs.readdir(folderToRead);     
    } catch (err) {
        console.log(err);
    }
   
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
