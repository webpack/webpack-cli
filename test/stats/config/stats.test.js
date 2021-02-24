'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');

// 'normal' is used in webpack.config.js
const statsPresets = ['detailed', 'errors-only', 'errors-warnings', 'minimal', 'verbose', 'none'];

if (isWebpack5) {
    statsPresets.push('summary');
}

describe('stats flag with config', () => {
    it('should compile without stats flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("preset: 'normal'");
        } else {
            expect(stdout).toContain("stats: 'normal'");
        }
    });

    for (const preset of statsPresets) {
        it(`should override 'noramal' value in config with "${preset}"`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--stats', `${preset}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();

            if (isWebpack5) {
                expect(stdout).toContain(`preset: '${preset}'`);
            } else {
                switch (preset) {
                    case 'normal':
                        expect(stdout).toContain('stats:');
                        break;
                    case 'detailed':
                        expect(stdout).toContain('entrypoints: true');
                        expect(stdout).toContain('errorDetails: true');
                        break;
                    case 'errors-only':
                        expect(stdout).toContain('all: false');
                        expect(stdout).toContain('errors: true');
                        break;
                    case 'errors-warnings':
                        expect(stdout).toContain('all: false');
                        expect(stdout).toContain('errors: true');
                        expect(stdout).toContain('warnings: true');
                        break;
                    case 'minimal':
                        expect(stdout).toContain('modules: true');
                        expect(stdout).toContain('maxModules: 0');
                        break;
                    case 'verbose':
                        expect(stdout).toContain("logging: 'verbose'");
                        break;
                    case 'none':
                        expect(stdout).toContain('all: false');
                        break;
                    default:
                        expect(stdout).toContain(`preset: '${preset}'`);
                }
            }
        });
    }
});
