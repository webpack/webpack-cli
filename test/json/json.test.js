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
    });
});
