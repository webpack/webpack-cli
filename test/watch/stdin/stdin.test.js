const { runAndGetWatchProc, processKill } = require('../../utils/test-utils');

describe('--watch-options-stdin', () => {
    it('should stop the process when stdin ends using "--watch" and "--watch-options-stdin" options', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--watch-options-stdin'], '', true);

        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);

            processKill(proc);

            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the "watch" command and the "--watch-options-stdin" option', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['watch', '--watch-options-stdin'], '', true);

        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);

            processKill(proc);

            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the config file', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--config', './watch.config.js'], '', true);

        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);

            processKill(proc);

            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the config file in multi compiler mode', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--config', './multi-watch.config.js'], '', true);

        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);

            processKill(proc);

            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the "serve" command and the "--watch-options-stdin" option', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['serve', '--watch-options-stdin'], '', true);
        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);
            processKill(proc);
            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the "serve" command and the "--stdin" option', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['serve', '--stdin'], '', true);
        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);
            processKill(proc);
            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the "serve" command and configuration', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['serve', '--config', './serve.config.js'], '', true);
        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);
            processKill(proc);
            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });

    it('should stop the process when stdin ends using the "serve" command and the config file in multi compiler mode', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--config', './multi-watch.config.js'], '', true);

        let semaphore = false;

        proc.on('exit', () => {
            expect(semaphore).toBe(true);

            processKill(proc);

            done();
        });

        proc.stdin.end(() => {
            semaphore = true;
        });
    });
});
