async function packageExists(packageName) {
    try {
        const { execSync } = require('child_process');
        const command = `try { console.log(require.resolve('${packageName}')); } catch (err) { console.log('Not Found');}`;
        const rootPath = execSync(`node -e "${command}"`, { encoding: 'utf8' }).trimEnd();

        if (!rootPath || rootPath === 'Not Found') {
            // Fallback to require resolve
            console.log('use fallback');
            console.log(rootPath);
            return require.resolve(packageName);
        }
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = packageExists;
