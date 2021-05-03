const packageExists = (packageName: string): string | false => {
    try {
        return require.resolve(packageName);
    } catch (error) {
        return false;
    }
}

export default packageExists;
