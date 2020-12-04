import info from '../src/index';

describe('info tests', () => {
    it('should log environment info', async () => {
        const envInfo = await info();

        expect(envInfo).toContain('System');
        expect(envInfo).toContain('Binaries');
        expect(envInfo).toContain('Browsers');
    });

    it('should log environment info as json', async () => {
        const envInfo = await info('--output', 'json');

        const parse = (): void => {
            const output = JSON.parse(envInfo);
            expect(output['System']).toBeTruthy();
            expect(output['Binaries']).toBeTruthy();
            expect(output['System']['OS']).toBeTruthy();
            expect(output['System']['CPU']).toBeTruthy();
        };

        expect(parse).not.toThrow();
    });

    it('should log environment info as markdown', async () => {
        const envInfo = await info('--output', 'markdown');

        expect(envInfo).toContain('## System');
        expect(envInfo).toContain('## Binaries');
        expect(envInfo).toContain('## Browsers');
    });
});
