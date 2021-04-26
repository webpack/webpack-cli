async function packageExists(packageName) {
    try {
        const execa = require('execa');
        const path = require('path');
        const command = `
        try {
          console.log(require.resolve('${packageName}'));
        } catch (err) {
          console.log('Not Found');
        }`;

        const { stdout: rootPath } = await execa('node', ['-e', command], {
            cwd: path.resolve(process.cwd()),
            reject: false,
            stdio: 'inherit',
            maxBuffer: Infinity,
        });

        console.log(rootPath);
        return rootPath && rootPath !== 'Not Found';
    } catch (err) {
        return false;
    }
}

module.exports = packageExists;
