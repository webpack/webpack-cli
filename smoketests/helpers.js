const fs = require('fs');
const path = require('path');

const ROOT_PATH = process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : path.resolve(__dirname, '..');

const getBinPath = () => path.resolve(ROOT_PATH, './packages/webpack-cli/bin/cli.js');

const getPkgPath = (pkg) => {
    const pkgPath = pkg.includes('webpack') ? `./node_modules/${pkg}` : `./node_modules/@webpack-cli/${pkg}`;
    return path.resolve(ROOT_PATH, pkgPath);
};

const swapPkgName = (current) => {
    // info -> .info and vice-versa
    const next = current.startsWith('.') ? current.substr(1) : `.${current}`;
    console.log(`  swapping ${current} with ${next}`);
    fs.renameSync(getPkgPath(current), getPkgPath(next));
};

module.exports = {
    getBinPath,
    swapPkgName,
};
