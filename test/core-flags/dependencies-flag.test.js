'use strict';

const { run } = require('../utils/test-utils');

describe('--dependencies and related flags', () => {
    it('should allow to set dependencies option', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--dependencies', 'lodash']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(`dependencies: [ 'lodash' ]`);
    });

    it('should reset dependencies option', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--dependencies-reset']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('dependencies: []');
    });
});
