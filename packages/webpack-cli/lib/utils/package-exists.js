function packageExists(packageName) {
    try {
        const { execSync } = require('child_process');

        const command = `
        try {
          console.log(require.resolve('${packageName}'));
        } catch (err) {
          console.log('Not Found');
        }`;

        const rootPath = execSync(`node -e "${command}"`, {
            encoding: 'utf8',
            cwd: process.cwd(),
        });
        return rootPath && rootPath !== 'Not Found';
    } catch (err) {
        return false;
    }
}

module.exports = packageExists;
