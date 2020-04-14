'use strict';
const { run } = require('../utils/test-utils');

describe('json flag', () => {
    it('should return valid json', () => {
        const { stdout } = run(__dirname, ['--json']);

        // helper function to check if JSON is valid
        const parseJson = () => {
            return JSON.parse(stdout);
        };
        // check the JSON is valid.
        expect(parseJson).not.toThrow();

        const jsonOutput = parseJson();

        // JSON return the correct keys
        expect(Object.keys(jsonOutput)).toEqual([
            'errors',
            'warnings',
            'version',
            'hash',
            'time',
            'builtAt',
            'publicPath',
            'outputPath',
            'assetsByChunkName',
            'assets',
            'filteredAssets',
            'entrypoints',
            'namedChunkGroups',
            'chunks',
            'modules',
            'filteredModules',
            'logging',
            'children',
        ]);
    });
});
