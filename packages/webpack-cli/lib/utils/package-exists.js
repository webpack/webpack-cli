function getPkg(packageName) {
    try {
        return require.resolve(packageName);
    } catch (error) {
        return false;
    }
}

module.exports = getPkg;
