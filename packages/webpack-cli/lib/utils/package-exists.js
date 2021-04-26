async function packageExists(packageName) {
    try {
        const execa = require('execa');

        const command = `
        try {
          console.log(require.resolve('${packageName}'));
        } catch (err) {
          console.log('Not Found');
        }`;

        const { stdout: rootPath } = await execa(`node -e "${command}"`, {
            encoding: 'utf8',
            cwd: process.cwd(),
        });

        console.log(rootPath);
        return rootPath && rootPath !== 'Not Found';
    } catch (err) {
        return false;
    }
}

module.exports = packageExists;
