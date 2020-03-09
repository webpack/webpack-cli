'use strict';

jest.mock('@webpack-cli/package-utils')

import { packageExists, promptInstallation } from '@webpack-cli/package-utils';
import ExternalCommand from '../../webpack-cli/lib/commands/ExternalCommand';

describe('@webpack-cli/package-utils', () => {
    it('should check existence of package', () => {
    	(packageExists as any).mockImplementation(() => true);
        const exists = packageExists('@webpack-cli/info');
        expect(exists).toBeTruthy();
    });

    it('should not throw if the user interrupts', async () => {
    	(promptInstallation as any).mockImplementation(() => { throw new Error() });
        await expect(ExternalCommand.run('info')).resolves.not.toThrow();
    });
});
