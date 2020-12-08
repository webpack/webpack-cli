const { runAndGetWatchProc } = require('../utils/test-utils');

describe('stdin', () => {
    it('should stop the process when stdin ends', (done) => {
        const proc = runAndGetWatchProc(__dirname, [], false, '', true);
        let semaphore = false;
        proc.on('exit', () => {
            expect(semaphore).toBe(true);
            proc.kill();
            done();
        });
        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop serve then stdin ends', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['serve'], false, '', true);
        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);
            proc.kill();
            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop watch then stdin ends', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = false;
        proc.on('exit', () => {
            expect(semaphore).toBe(true);
            proc.kill();
            done();
        });
        proc.stdin.end(() => {
            semaphore = true;
        });
    });
});
