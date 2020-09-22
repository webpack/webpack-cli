export function packageExists(packageName: string): boolean {
    try {
        require(packageName);
        return true;
    } catch (err) {
        return false;
    }
}
