const { mkdirSync, existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const assetsPath = resolve(__dirname, './test-assets');
const ENTER = '\x0D';
const DOWN = '\x1B\x5B\x42';

describe('init command', () => {
    beforeEach(async () => {
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!existsSync(assetsPath)) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
        mkdirSync(assetsPath);
    });

    afterEach(() => {
        rimraf.sync(assetsPath);
    });

    it('should generate default project when nothing is passed', () => {
        const { stdout, stderr } = run(assetsPath, ['init', '--use-defaults']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should generate project when generationPath is supplied', () => {
        const { stdout, stderr } = run(__dirname, ['init', assetsPath, '--use-defaults']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should generate folders if non existing generation path is given', () => {
        rimraf.sync(assetsPath);
        const { stdout, stderr } = run(__dirname, ['init', assetsPath, '--use-defaults']);
        expect(stdout).toContain("generation path doesn't exist, required folders will be created.");
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should ask question when wrong template is supplied', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ['init', '--use-defaults', '--template=apple'], [`${ENTER}`]);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stdout).toContain('apple is not a valid template, please select one from below');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should generate typescript project correctly', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            assetsPath,
            ['init'],
            [`${DOWN}${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${ENTER}`],
        );
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');
        expect(stderr).toContain('tsconfig.json');

        // Test files
        const files = ['package.json', 'src', 'src/index.ts', 'webpack.config.js', 'tsconfig.json'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should generate ES6 project correctly', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            assetsPath,
            ['init'],
            [`${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${ENTER}`],
        );
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');
        expect(stderr).toContain('.babelrc');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js', '.babelrc'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should use sass in project when selected', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            assetsPath,
            ['init'],
            [`${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${DOWN}${DOWN}${ENTER}`],
        );
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if loaders are added to webpack configuration
        expect(readFileSync(resolve(assetsPath, 'webpack.config.js')).toString()).toContain(
            "use: ['style-loader', 'css-loader', 'sass-loader'],",
        );
    });

    it('should use less in project when selected', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            assetsPath,
            ['init'],
            [`${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${DOWN}${DOWN}${DOWN}${ENTER}`],
        );
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if loaders are added to webpack configuration
        expect(readFileSync(resolve(assetsPath, 'webpack.config.js')).toString()).toContain("loader: 'less-loader',");
    });

    it('should use stylus in project when selected', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            assetsPath,
            ['init'],
            [`${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${DOWN}${DOWN}${DOWN}${DOWN}${ENTER}`],
        );
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if loaders are added to webpack configuration
        expect(readFileSync(resolve(assetsPath, 'webpack.config.js')).toString()).toContain("loader: 'stylus-loader',");
    });
});
