jest.setMock('../lib/prompt-installation', {
    promptInstallation: jest.fn(),
});

import ExternalCommand from '../../webpack-cli/lib/commands/resolveCommand';
import { packageExists, promptInstallation } from '../lib';

describe('@webpack-cli/utils', () => {
    it('should check existence of package', () => {
        // use an actual path relative to the packageUtils file
        expect(packageExists('../lib/package-exists')).toBeTruthy();
        expect(packageExists('./nonexistent-package')).toBeFalsy();
    });

    it('should not throw if the user interrupts', async () => {
        (promptInstallation as jest.Mock).mockImplementation(() => {
            throw new Error();
        });
        await expect(ExternalCommand('info')).resolves.not.toThrow();
    });
});
