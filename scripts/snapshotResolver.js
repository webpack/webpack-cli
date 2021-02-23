const { dirname, basename } = require('path');
const { version } = require('webpack');

// For these tests we create different snapshot dir per version
const customSnapshotDir = ['help'];

module.exports = {
    // resolves from test to snapshot path
    resolveSnapshotPath: (testPath, snapshotExtension) => {
        const perVersionDir = customSnapshotDir.some((dir) => testPath.includes(`test/${dir}`));
        const snapshotDirName = !perVersionDir ? '__snapshots__' : `__snapshots-v${version[0]}__`;
        return `${dirname(testPath)}/${snapshotDirName}/${basename(testPath) + snapshotExtension}`;
    },

    // resolves from snapshot to test path
    resolveTestPath: (snapshotFilePath, snapshotExtension) => {
        const perVersionDir = customSnapshotDir.some((dir) => snapshotFilePath.includes(`test/${dir}`));
        const snapshotDirName = !perVersionDir ? '__snapshots__' : `__snapshots-v${version[0]}__`;
        return snapshotFilePath.replace(`/${snapshotDirName}`, '').slice(0, -snapshotExtension.length);
    },

    // Example test path, used for preflight consistency check of the implementation above
    testPathForConsistencyCheck: 'some/__tests__/example.test.js',
};
