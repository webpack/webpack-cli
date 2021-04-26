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
        }).trimEnd();

        console.log(rootPath);

        return rootPath !== 'Not Found';
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = packageExists;
