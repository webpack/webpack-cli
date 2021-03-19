const fs = require('fs');
const path = require('path');

const ROOT_PATH = process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : path.resolve(__dirname, '..');

const getBinPath = () => path.resolve(ROOT_PATH, './packages/webpack-cli/bin/cli.js');

const getPkgPath = (pkg, isSubPackage) => {
    const pkgPath = isSubPackage ? `./node_modules/@webpack-cli/${pkg}` : `./node_modules/${pkg}`;
    return path.resolve(ROOT_PATH, pkgPath);
};

const swapPkgName = (current, isSubPackage = false) => {
    // info -> .info and vice-versa
    const next = current.startsWith('.') ? current.substr(1) : `.${current}`;
    console.log(`  swapping ${current} with ${next}`);
    fs.renameSync(getPkgPath(current, isSubPackage), getPkgPath(next, isSubPackage));
};

module.exports = {
    getBinPath,
    swapPkgName,
};
