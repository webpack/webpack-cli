'use strict';

const { run } = require('../../utils/test-utils');
const PROGRESS_TEXT = 'Compilation completed';

describe('multi config display output', () => {
    it('should display profiling information', () => {
        const { stdout, stderr } = run(__dirname, ['--progress']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(PROGRESS_TEXT);
    });
});
