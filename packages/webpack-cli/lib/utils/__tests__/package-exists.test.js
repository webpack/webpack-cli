jest.setMock('../prompt-installation', jest.fn());

const ExternalCommand = require('../resolve-command');
const packageExists = require('../package-exists');
const promptInstallation = require('../prompt-installation');

describe('@webpack-cli/utils', () => {
    it('should check existence of package', () => {
        // use an actual path relative to the packageUtils file
        expect(packageExists('./logger')).toBeTruthy();
        expect(packageExists('./nonexistent-package')).toBeFalsy();
    });

    it.skip('should not throw if the user interrupts', async () => {
        promptInstallation.mockImplementation(() => {
            throw new Error();
        });
        await expect(ExternalCommand('@webpack-cli/info')).resolves.not.toThrow();
    });
});
