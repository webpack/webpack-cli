'use strict';

jest.mock('@webpack-cli/package-utils');

import { packageExists, promptInstallation } from '@webpack-cli/package-utils';
import { run } from '../../webpack-cli/lib/commands/resolveCommand';

describe('@webpack-cli/package-utils', () => {
    it('should check existence of package', () => {
        (packageExists as jest.Mock).mockImplementation(() => true);
        const exists = packageExists('@webpack-cli/info');
        expect(exists).toBeTruthy();
    });

    it('should not throw if the user interrupts', async () => {
        (promptInstallation as jest.Mock).mockImplementation(() => {
            throw new Error();
        });
        await expect(run('info')).resolves.not.toThrow();
    });
});
