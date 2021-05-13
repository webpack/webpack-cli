const childProcess = require('child_process');

// Node.js has cache on `require.resolve` and second `require` throws the error with `MODULE_NOT_FOUND` code
function packageExists(packageName) {
    const nodePath = process.execPath;
    const nodeOptions = process.execArgv.filter((arg) => !arg.startsWith('--inspect'));
    const command = `require.resolve(${JSON.stringify(packageName)})`;

    const result = childProcess.spawnSync(nodePath, [...nodeOptions, '-e', command], { encoding: 'utf8', maxBuffer: 1000 * 1000 * 100 });

    return result.status === 0;
}

module.exports = packageExists;
