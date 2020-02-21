'use strict';

import { packageExists } from '../src';

describe('@webpack-cli/package-utils', () => {
    it('should check existence of package', () => {
        const exists = packageExists('info');

        expect(exists).toBeTruthy();
    });
});
