const ExternalCommand = require('../../lib/commands/external');

describe('external command', () => {
    it('should check existence of package', () => {
        const exists = ExternalCommand.checkIfPackageExists('info');

        expect(exists).toBeTruthy();
    });
});
