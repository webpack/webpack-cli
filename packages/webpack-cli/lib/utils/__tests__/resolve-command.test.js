jest.setMock('../prompt-installation', jest.fn());

const resolveCommand = require('../resolve-command');
const promptInstallation = require('../prompt-installation');

describe('resolve-command util', () => {
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        processExitSpy.mockClear();
        consoleErrorSpy.mockClear();
    });

    it('should not throw error', async () => {
        promptInstallation.mockImplementation(() => {});

        await expect(resolveCommand('info')).resolves.not.toThrow();
        expect(processExitSpy.mock.calls.length).toBe(0);
        expect(consoleErrorSpy.mock.calls.length).toBe(0);
    });

    it('should throw error and exit with invalid command', async () => {
        promptInstallation.mockImplementation(() => {
            throw new Error();
        });

        await resolveCommand('invalid');
        expect(processExitSpy).toBeCalledWith(2);
        expect(consoleErrorSpy.mock.calls.length).toBe(1);
    });
});
