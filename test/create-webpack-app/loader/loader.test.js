"use strict";

const { existsSync } = require("node:fs");
const { join, resolve } = require("node:path");

// eslint-disable-next-line jest/no-confusing-set-timeout
jest.setTimeout(480000);

const {
  createPathDependentUtils,
  normalizeStdout,
  uniqueDirectoryForTest,
} = require("../test.utils");

const { runPromptWithAnswers } = createPathDependentUtils("create-webpack-app");
const { run } = createPathDependentUtils("webpack-cli");
const firstPrompt = "? Loader name? (my-loader)";
const ENTER = "\u000D";
const DOWN = "\u001B\u005B\u0042";

const dataForTests = (rootAssetsPath) => ({
  loaderName: "test-loader",
  loaderPath: join(rootAssetsPath, "test-loader"),
  defaultLoaderPath: join(rootAssetsPath, "my-loader"),
  genPath: join(rootAssetsPath, "test-assets"),
  customLoaderPath: join(rootAssetsPath, "test-assets", "loaderName"),
  defaultTemplateFiles: [
    "package.json",
    "package-lock.json",
    "examples",
    "src",
    "test",
    "src/index.js",
    "examples/simple/webpack.config.js",
  ],
});

describe("loader command", () => {
  it("should scaffold loader with default name if no loader name provided", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { defaultLoaderPath, defaultTemplateFiles } = dataForTests(assetsPath);
    let { stdout } = await runPromptWithAnswers(assetsPath, ["loader", "."], [ENTER, ENTER]);

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Skip test in case installation fails
    if (!existsSync(resolve(defaultLoaderPath, "./package-lock.json"))) {
      return;
    }

    // Check if the output directory exists with the appropriate loader name
    expect(existsSync(defaultLoaderPath)).toBeTruthy();

    // All test files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(defaultLoaderPath, file))).toBeTruthy();
    }

    // Check if the generated loader works successfully
    const path = resolve(defaultLoaderPath, "./examples/simple/");

    ({ stdout } = await run(path, []));

    expect(stdout).toContain("my-loader");
  });

  it("should scaffold loader template with a given name", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { loaderName, loaderPath, defaultTemplateFiles } = dataForTests(assetsPath);
    let { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["loader", "."],
      [`${loaderName}${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Skip test in case installation fails
    if (!existsSync(resolve(loaderPath, "./package-lock.json"))) {
      return;
    }

    // Check if the output directory exists with the appropriate loader name
    expect(existsSync(loaderPath)).toBeTruthy();

    // All test files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(loaderPath, file))).toBeTruthy();
    }

    // Check if the generated loader works successfully
    const path = resolve(loaderPath, "./examples/simple/");

    ({ stdout } = await run(path, []));

    expect(stdout).toContain("test-loader");
  });

  it("should scaffold loader template in the specified path", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { loaderName, customLoaderPath, defaultTemplateFiles } = dataForTests(assetsPath);
    let { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["loader", "test-assets"],
      [`${loaderName}${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Skip test in case installation fails
    if (!existsSync(resolve(customLoaderPath, "./package-lock.json"))) {
      return;
    }

    // Check if the output directory exists with the appropriate loader name
    expect(existsSync(customLoaderPath)).toBeTruthy();

    // All test files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(customLoaderPath, file))).toBeTruthy();
    }

    // Check if the generated loader works successfully
    const path = resolve(customLoaderPath, "./examples/simple/");

    ({ stdout } = await run(path, []));

    expect(stdout).toContain("test-loader");
  });

  it("should scaffold loader template in the current directory", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { loaderName, customLoaderPath, defaultTemplateFiles } = dataForTests(assetsPath);

    let { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["loader", "./"],
      [`${loaderName}${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Skip test in case installation fails
    if (!existsSync(resolve(customLoaderPath, "./package-lock.json"))) {
      return;
    }

    // Check if the output directory exists with the appropriate loader name
    expect(existsSync(customLoaderPath)).toBeTruthy();

    // All test files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(customLoaderPath, file))).toBeTruthy();
    }

    // Check if the generated loader works successfully
    const path = resolve(customLoaderPath, "./examples/simple/");

    ({ stdout } = await run(path, []));

    expect(stdout).toContain("test-loader");
  });

  it("should prompt on supplying an invalid template", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stderr } = await runPromptWithAnswers(assetsPath, [
      "loader",
      ".",
      "--template=unknown",
    ]);

    expect(stderr).toContain("unknown is not a valid template");
  });

  it("recognizes '-t' as an alias for '--template'", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { defaultLoaderPath, defaultTemplateFiles } = dataForTests(assetsPath);
    let { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["loader", ".", "-t", "default"],
      [ENTER, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Skip test in case installation fails
    if (!existsSync(resolve(defaultLoaderPath, "./package-lock.json"))) {
      return;
    }

    // Check if the output directory exists with the appropriate loader name
    expect(existsSync(defaultLoaderPath)).toBeTruthy();

    // All test files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(defaultLoaderPath, file))).toBeTruthy();
    }

    // Check if the generated loader works successfully
    const path = resolve(assetsPath, "./my-loader/examples/simple/");

    ({ stdout } = await run(path, []));

    expect(stdout).toContain("my-loader");
  });

  it("uses yarn as the package manager when opted", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { defaultLoaderPath, defaultTemplateFiles } = dataForTests(assetsPath);
    let { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["loader", ".", "-t", "default"],
      [ENTER, `${DOWN}${ENTER}`],
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
      ...defaultTemplateFiles.filter((file) => file !== "package-lock.json"),
      "yarn.lock",
    ];

    for (const file of files) {
      expect(existsSync(resolve(defaultLoaderPath, file))).toBeTruthy();
    }

    // Check if the generated loader works successfully
    const path = resolve(assetsPath, "./my-loader/examples/simple/");

    ({ stdout } = await run(path, []));

    expect(stdout).toContain("my-loader");
  });
});
