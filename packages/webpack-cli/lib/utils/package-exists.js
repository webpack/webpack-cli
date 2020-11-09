function packageExists(packageName) {
    try {
        require.resolve(packageName);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = packageExists;
