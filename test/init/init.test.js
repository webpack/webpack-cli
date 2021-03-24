const { mkdirSync, existsSync, readFileSync } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const assetsPath = resolve(__dirname, './test-assets');
const ENTER = '\x0D';
const DOWN = '\x1B\x5B\x42';

// Helper to read from package.json in a given path
const readFromPkgJSON = (path) => {
    const pkgJSONPath = join(path, 'package.json');
    if (!existsSync(pkgJSONPath)) {
        return {};
    }
    const pkgJSON = JSON.parse(readFileSync(pkgJSONPath, 'utf8'));
    const { devDependencies: devDeps } = pkgJSON;
    // Update devDeps versions to be x.x.x to prevent frequent snapshot updates
    Object.keys(devDeps).forEach((dep) => (devDeps[dep] = 'x.x.x'));
    return { ...pkgJSON, devDependencies: devDeps };
};

// Helper to read from webpack.config.js in a given path
const readFromWebpackConfig = (path) => readFileSync(join(path, 'webpack.config.js'), 'utf8');

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
        const { stdout, stderr } = run(assetsPath, ['init', '--force']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
    });
    it('should generate project when generationPath is supplied', () => {
        const { stdout, stderr } = run(__dirname, ['init', assetsPath, '--force']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
    });

    it('should generate folders if non existing generation path is given', () => {
        rimraf.sync(assetsPath);
        const { stdout, stderr } = run(__dirname, ['init', assetsPath, '--force']);
        expect(stdout).toContain("generation path doesn't exist, required folders will be created.");
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
    });

    it('should configure assets modules by default', () => {
        rimraf.sync(assetsPath);
        const { stdout, stderr } = run(__dirname, ['init', assetsPath, '--force']);
        expect(stdout).toContain("generation path doesn't exist, required folders will be created.");
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
    });

    it('should ask question when wrong template is supplied', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ['init', '--force', '--template=apple'], [`${ENTER}`]);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stdout).toContain('apple is not a valid template, please select one from below');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
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

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
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

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
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

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
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

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
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

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
    });

    it('should configure WDS as opted', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ['init'], [ENTER, ENTER, `n${ENTER}`, ENTER]);
        expect(stdout).toContain('Do you want to use webpack-dev-server?');
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
    });

    it('should use postcss in project when selected', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            assetsPath,
            ['init'],
            [`${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${DOWN}${DOWN}${DOWN}${DOWN}${DOWN}${ENTER}`],
        );
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js', 'postcss.config.js'];

        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
    });

    it('should configure html-webpack-plugin as opted', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ['init'], [ENTER, `n${ENTER}`, ENTER, ENTER]);
        expect(stdout).toContain('Do you want to simplify the creation of HTML files for your bundle?');
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });

        // Check if the generated package.json file content matches the snapshot
        expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();

        // Check if the generated webpack configuration matches the snapshot
        expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
    });
});
