import * as assert from 'yeoman-assert';
import { run } from 'yeoman-test';
import { join } from 'path';

describe('init generator', () => {
    it('generates a webpack config with default options', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index',
            outputDir: 'dist',
            langType: 'No',
            stylingType: 'No',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index.js', 'sw.js'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // Check generated file contents
        assert.fileContent(join(outputDir, 'package.json'), '"name": "my-webpack-project"');
        assert.fileContent(join(outputDir, 'README.md'), 'Welcome to your new awesome project!');
        assert.fileContent(join(outputDir, 'src', 'index.js'), "console.log('Hello World from your main file!');");
        assert.fileContent(join(outputDir, 'sw.js'), "self.addEventListener('install'");

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        // since default options were used, entry and output are not specified
        // in the generated config file
        expect(config.entry).toEqual(undefined);
        expect(config.output).toEqual(undefined);
        // there are no special loaders, so rules should be empty
        expect(config.module.rules).toEqual([]);
    });

    it('generates a webpack config with custom entry and output', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index2',
            outputDir: 'dist2',
            langType: 'No',
            stylingType: 'No',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index2.js'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // this file is only added if the default options are used
        assert.noFile(join(outputDir, 'sw.js'));

        // Check generated file contents
        assert.fileContent(join(outputDir, 'src', 'index2.js'), "console.log('Hello World from your main file!');");

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.entry).toEqual("'./src/index2.js'");
        expect(config.output.path).toEqual("path.resolve(__dirname, 'dist2')");
        // there are no special loaders, so rules should be empty
        expect(config.module.rules).toEqual([]);
    });

    it('generates a webpack config using CSS without mini-css-extract-plugin', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index',
            outputDir: 'dist',
            langType: 'No',
            stylingType: 'CSS',
            useExtractPlugin: false,
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index.js'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.module.rules[0].test).toEqual('/.css$/');
        expect(config.module.rules[0].use.length).toEqual(2);
        expect(config.module.rules[0].use[0].loader).toEqual('"style-loader"');
        expect(config.module.rules[0].use[1].loader).toEqual('"css-loader"');
    });

    it('generates a webpack config using CSS with mini-css-extract-plugin', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index',
            outputDir: 'dist',
            langType: 'No',
            stylingType: 'CSS',
            useExtractPlugin: true,
            cssBundleName: 'main',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index.js'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.module.rules[0].test).toEqual('/.css$/');
        expect(config.module.rules[0].use.length).toEqual(3);
        expect(config.module.rules[0].use[0].loader).toEqual('MiniCssExtractPlugin.loader');
        expect(config.module.rules[0].use[1].loader).toEqual('"style-loader"');
        expect(config.module.rules[0].use[2].loader).toEqual('"css-loader"');
    });

    it('generates a webpack config with multiple entries', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: true,
            multipleEntries: 'test1, test2',
            test1: 'dir1/test1',
            test2: 'dir2/test2',
            outputDir: 'dist',
            langType: 'No',
            stylingType: 'No',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'dir1/test1.js', 'dir2/test2.js'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // Check generated file contents
        assert.fileContent(join(outputDir, 'dir1', 'test1.js'), "console.log('Hello World from test1 main file!');");
        assert.fileContent(join(outputDir, 'dir2', 'test2.js'), "console.log('Hello World from test2 main file!');");

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.entry).toEqual({
            test1: "'./dir1/test1.js'",
            test2: "'./dir2/test2.js'",
        });
    });

    it('generates a webpack config that uses ES6', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index',
            outputDir: 'dist',
            langType: 'ES6',
            stylingType: 'No',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index.js', '.babelrc'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.module.rules).toEqual([
            {
                test: '/\\.(js|jsx)$/',
                include: ["path.resolve(__dirname, 'src')"],
                loader: "'babel-loader'",
            },
        ]);
    });

    it('generates a webpack config that uses Typescript', async () => {
        const outputDir = await run(join(__dirname, '../src/init-generator.ts')).withPrompts({
            multiEntries: false,
            singularEntry: 'src/index',
            outputDir: 'dist',
            langType: 'Typescript',
            stylingType: 'No',
        });

        // Check that all the project files are generated with the correct name
        const filePaths = ['package.json', 'README.md', 'src/index.ts', 'tsconfig.json'];
        assert.file(filePaths.map((file) => join(outputDir, file)));

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const output = require(join(outputDir, '.yo-rc.json'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = (Object.entries(output)[0][1] as any).configuration.config.webpackOptions;
        expect(config.module.rules).toEqual([
            {
                test: '/\\.(ts|tsx)$/',
                include: ["path.resolve(__dirname, 'src')"],
                loader: "'ts-loader'",
                exclude: ['/node_modules/'],
            },
        ]);
    });
});
