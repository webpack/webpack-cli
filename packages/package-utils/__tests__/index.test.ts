'use strict';

jest.mock('../lib/packageUtils', () => {
    return {
        packageExists: jest.fn(),
        promptInstallation: jest.fn(),
    };
});

import { packageExists, promptInstallation } from '../lib/packageUtils';
import run from '../../webpack-cli/lib/commands/resolveCommand';

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
