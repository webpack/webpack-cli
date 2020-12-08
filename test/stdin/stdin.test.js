const { runAndGetWatchProc } = require('../utils/test-utils');

describe('stdin', () => {
    it('should stop the process when stdin ends', () => {
        const proc = runAndGetWatchProc(__dirname, [], false, '', true);
        let semaphore = false;
        proc.on('exit', () => {
            expect(semaphore).toBe(true);
        });
        proc.stdin.end(() => {
            semaphore = true;
        });
    });
});
