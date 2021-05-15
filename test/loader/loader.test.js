"use strict";

const { existsSync } = require("fs");
const { join, resolve } = require("path");
const {
    run,
    runPromptWithAnswers,
    uniqueDirectoryForTest,
    normalizeStdout,
} = require("../utils/test-utils");

const firstPrompt = "? Loader name (my-loader)";
const ENTER = "\x0D";
const dataForTests = (rootAssetsPath) => ({
    loaderName: "test-loader",
    loaderPath: join(rootAssetsPath, "test-loader"),
    defaultLoaderPath: join(rootAssetsPath, "my-loader"),
    genPath: join(rootAssetsPath, "test-assets"),
    customLoaderPath: join(rootAssetsPath, "test-assets", "loaderName"),
});

describe("loader command", () => {
    it("should ask the loader name when invoked", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ["loader"]);

        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain(firstPrompt);
    });

    it("should scaffold loader with default name if no loader name provided", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { defaultLoaderPath } = dataForTests(assetsPath);
        let { stdout } = await runPromptWithAnswers(assetsPath, ["loader"], [`${ENTER}`]);

        expect(normalizeStdout(stdout)).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(defaultLoaderPath, "./yarn.lock"))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(defaultLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = [
            "package.json",
            "examples",
            "src",
            "test",
            "src/index.js",
            "examples/simple/webpack.config.js",
        ];

        files.forEach((file) => {
            expect(existsSync(defaultLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(__dirname, "./my-loader/examples/simple/");

        ({ stdout } = await run(path, []));

        expect(stdout).toContain("my-loader");
    });

    it("should scaffold loader template with a given name", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { loaderName, loaderPath } = dataForTests(assetsPath);
        let { stdout } = await runPromptWithAnswers(
            assetsPath,
            ["loader"],
            [`${loaderName}${ENTER}`],
        );

        expect(normalizeStdout(stdout)).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(loaderPath, "./yarn.lock"))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(loaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = [
            "package.json",
            "examples",
            "src",
            "test",
            "src/index.js",
            "examples/simple/webpack.config.js",
        ];

        files.forEach((file) => {
            expect(existsSync(loaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(__dirname, "./test-loader/examples/simple/");

        ({ stdout } = await run(path, []));

        expect(stdout).toContain("test-loader");
    });

    it("should scaffold loader template in the specified path", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { loaderName, customLoaderPath } = dataForTests(assetsPath);
        let { stdout } = await runPromptWithAnswers(
            assetsPath,
            ["loader", "test-assets"],
            [`${loaderName}${ENTER}`],
        );

        expect(normalizeStdout(stdout)).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(customLoaderPath, "./yarn.lock"))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(customLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = [
            "package.json",
            "examples",
            "src",
            "test",
            "src/index.js",
            "examples/simple/webpack.config.js",
        ];

        files.forEach((file) => {
            expect(existsSync(customLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(customLoaderPath, "./examples/simple/");

        ({ stdout } = await run(path, []));

        expect(stdout).toContain("test-loader");
    });

    it("should scaffold loader template in the current directory", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { loaderName, customLoaderPath } = dataForTests(assetsPath);

        let { stdout } = await runPromptWithAnswers(
            assetsPath,
            ["loader", "./"],
            [`${loaderName}${ENTER}`],
        );

        expect(normalizeStdout(stdout)).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(customLoaderPath, "./yarn.lock"))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(customLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = [
            "package.json",
            "examples",
            "src",
            "test",
            "src/index.js",
            "examples/simple/webpack.config.js",
        ];

        files.forEach((file) => {
            expect(existsSync(customLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(customLoaderPath, "./examples/simple/");

        ({ stdout } = await run(path, []));

        expect(stdout).toContain("test-loader");
    });

    it("should prompt on supplying an invalid template", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { stderr } = await runPromptWithAnswers(assetsPath, ["loader", "--template=unknown"]);

        expect(stderr).toContain("unknown is not a valid template");
    });

    it("recognizes '-t' as an alias for '--template'", async () => {
        const assetsPath = await uniqueDirectoryForTest();
        const { defaultLoaderPath } = dataForTests(assetsPath);
        let { stdout } = await runPromptWithAnswers(
            assetsPath,
            ["loader", "-t", "default"],
            [`${ENTER}`],
        );

        expect(normalizeStdout(stdout)).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(defaultLoaderPath, "./yarn.lock"))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(defaultLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = [
            "package.json",
            "examples",
            "src",
            "test",
            "src/index.js",
            "examples/simple/webpack.config.js",
        ];

        files.forEach((file) => {
            expect(existsSync(defaultLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(__dirname, "./my-loader/examples/simple/");

        ({ stdout } = await run(path, []));

        expect(stdout).toContain("my-loader");
    });
});
