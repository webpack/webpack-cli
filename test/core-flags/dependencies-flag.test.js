'use strict';

const { run } = require('../utils/test-utils');

describe('--dependencies and related flags', () => {
    it('should allow to set dependencies option', () => {
        const { stderr, stdout } = run(__dirname, ['--dependencies', 'lodash']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`dependencies: [ 'lodash' ]`);
    });

    it('should reset dependencies option', () => {
        const { stderr, stdout } = run(__dirname, ['--dependencies-reset']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('dependencies: []');
    });
});
