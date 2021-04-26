function packageExists(packageName) {
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

    return rootPath !== 'Not Found';
}

module.exports = packageExists;
