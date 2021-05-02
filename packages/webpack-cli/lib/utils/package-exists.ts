const packageExists = (packageName: string): string | false => {
    try {
        console.log(require.resolve(packageName))
        return require.resolve(packageName);
    } catch (error) {
        return false;
    }
}

export default packageExists;
