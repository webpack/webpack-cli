// eslint-disable-next-line node/no-unpublished-require
const execa = require('execa');
// eslint-disable-next-line node/no-unpublished-require
const { red, green } = require('colorette');
const collectTestFolders = require('./utils');

const PACKAGE = 'package.json';

const getFoldersWithPackage = (stats, file) => {
    return stats.isFile() && file === PACKAGE;
};

(async () => {
    try {
        const folders = collectTestFolders(getFoldersWithPackage);
        for (const folder of folders) {
            await execa('yarn', {
                cwd: folder,
                stdio: 'inherit',
            });
        }
        console.log(green(' Successfully prepared the test suite '));
    } catch (e) {
        console.error(red(' Unable to prepare the test suite '));
        console.error(e.stack);
        process.exitCode = 1;
    }
})();
