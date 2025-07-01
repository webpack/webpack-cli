const { existsSync, mkdirSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { normalizeStderr, normalizeStdout, uniqueDirectoryForTest } = require("../test.utils");
const { createPathDependentUtils } = require("../test.utils");

// eslint-disable-next-line jest/no-confusing-set-timeout
jest.setTimeout(480000);

const webpackCliUtils = createPathDependentUtils("webpack-cli");
const createWebpackAppUtils = createPathDependentUtils("create-webpack-app");
const { runPromptWithAnswers } = createWebpackAppUtils;
const { run } = webpackCliUtils;

const ENTER = "\u000D";
const DOWN = "\u001B\u005B\u0042";

const firstPrompt = "? Plugin name";
const dataForTests = (rootAssetsPath) => ({
  pluginName: "test-plugin",
  pluginPath: join(rootAssetsPath, "test-plugin"),
  defaultPluginPath: join(rootAssetsPath, "my-webpack-plugin"),
  genPath: join(rootAssetsPath, "test-assets"),
  customPluginPath: join(rootAssetsPath, "test-assets", "test-plugin"),
  defaultTemplateFiles: [
    "package.json",
    "examples",
    "src",
    "test",
    "src/index.js",
    "examples/simple/webpack.config.js",
  ],
});

describe("plugin command", () => {
  it("should ask the plugin name when invoked", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ["plugin", "."]);

    expect(stdout).toBeTruthy();
    expect(normalizeStderr(stderr)).toBeFalsy();
    expect(normalizeStdout(stdout)).toContain(firstPrompt);
  });

  it("should scaffold plugin with default name if no plugin name provided", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { defaultPluginPath, defaultTemplateFiles } = dataForTests(assetsPath);
    const { stdout } = await runPromptWithAnswers(assetsPath, ["plugin", "."], [ENTER, ENTER]);

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Check if the output directory exists with the appropriate plugin name
    expect(existsSync(defaultPluginPath)).toBeTruthy();

    // Skip test in case installation fails
    if (!existsSync(resolve(defaultPluginPath, "./package-lock.json"))) {
      return;
    }

    // Test regressively files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(join(defaultPluginPath, file))).toBeTruthy();
    }

    // Check if the generated plugin works successfully
    const { stdout: stdout2 } = await run(defaultPluginPath, [
      "--config",
      "./examples/simple/webpack.config.js",
    ]);
    expect(normalizeStdout(stdout2)).toContain("Hello World!");
  });

  it("should scaffold plugin template with a given name", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { pluginName, pluginPath, defaultTemplateFiles } = dataForTests(assetsPath);
    const { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["plugin", "."],
      [`${pluginName}${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Check if the output directory exists with the appropriate plugin name
    expect(existsSync(pluginPath)).toBeTruthy();

    // Skip test in case installation fails
    if (!existsSync(resolve(pluginPath, "./package-lock.json"))) {
      return;
    }

    // Test regressively files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(join(pluginPath, file))).toBeTruthy();
    }

    // Check if the generated plugin works successfully
    const { stdout: stdout2 } = await run(pluginPath, [
      "--config",
      "./examples/simple/webpack.config.js",
    ]);
    expect(normalizeStdout(stdout2)).toContain("Hello World!");
  });

  it("should scaffold plugin template in the specified path", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { pluginName, customPluginPath, defaultTemplateFiles } = dataForTests(assetsPath);
    const { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["plugin", "test-assets"],
      [`${pluginName}${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Check if the output directory exists with the appropriate plugin name
    expect(existsSync(customPluginPath)).toBeTruthy();

    // Skip test in case installation fails
    if (!existsSync(resolve(customPluginPath, "./package-lock.json"))) {
      return;
    }

    // Test regressively files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(join(customPluginPath, file))).toBeTruthy();
    }

    // Check if the generated plugin works successfully
    const { stdout: stdout2 } = await run(customPluginPath, [
      "--config",
      "./examples/simple/webpack.config.js",
    ]);
    expect(normalizeStdout(stdout2)).toContain("Hello World!");
  });

  it("should scaffold plugin template in the current directory", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { genPath, customPluginPath, pluginName, defaultTemplateFiles } =
      dataForTests(assetsPath);

    if (!existsSync(genPath)) {
      mkdirSync(genPath);
    }

    const { stdout } = await runPromptWithAnswers(
      genPath,
      ["plugin", "./"],
      [`${pluginName}${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Check if the output directory exists with the appropriate plugin name
    expect(existsSync(customPluginPath)).toBeTruthy();

    // Skip test in case installation fails
    if (!existsSync(resolve(customPluginPath, "./package-lock.json"))) {
      return;
    }

    // Test regressively files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(join(customPluginPath, file))).toBeTruthy();
    }

    // Check if the generated plugin works successfully
    const { stdout: stdout2 } = await run(customPluginPath, [
      "--config",
      "./examples/simple/webpack.config.js",
    ]);
    expect(normalizeStdout(stdout2)).toContain("Hello World!");
  });

  it("should prompt on supplying an invalid template", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stderr } = await runPromptWithAnswers(assetsPath, ["plugin", "--template=unknown"]);

    expect(stderr).toContain("unknown is not a valid template");
  });

  it("recognizes '-t' as an alias for '--template'", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { defaultPluginPath, defaultTemplateFiles } = dataForTests(assetsPath);
    const { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["plugin", ".", "-t", "default"],
      [`${ENTER}`, ENTER],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Check if the output directory exists with the appropriate plugin name
    expect(existsSync(defaultPluginPath)).toBeTruthy();

    // Skip test in case installation fails
    if (!existsSync(resolve(defaultPluginPath, "./package-lock.json"))) {
      return;
    }

    // Test regressively files are scaffolded
    for (const file of defaultTemplateFiles) {
      expect(existsSync(join(defaultPluginPath, file))).toBeTruthy();
    }

    // Check if the generated plugin works successfully
    const { stdout: stdout2 } = await run(defaultPluginPath, [
      "--config",
      "./examples/simple/webpack.config.js",
    ]);
    expect(normalizeStdout(stdout2)).toContain("Hello World!");
  });

  it("uses yarn as the package manager when opted", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { defaultPluginPath, defaultTemplateFiles } = dataForTests(assetsPath);
    const { stdout } = await runPromptWithAnswers(
      assetsPath,
      ["plugin", "."],
      [`${ENTER}`, `${DOWN}${ENTER}`],
    );

    expect(normalizeStdout(stdout)).toContain(firstPrompt);

    // Check if the output directory exists with the appropriate plugin name
    expect(existsSync(defaultPluginPath)).toBeTruthy();

    // Skip test in case installation fails
    if (!existsSync(resolve(defaultPluginPath, "./yarn.lock"))) {
      return;
    }

    // Test regressively files are scaffolded
    const files = [
      ...defaultTemplateFiles.filter((file) => file !== "package-lock.json"),
      "yarn.lock",
    ];

    for (const file of files) {
      expect(existsSync(join(defaultPluginPath, file))).toBeTruthy();
    }

    // Check if the generated plugin works successfully
    const { stdout: stdout2 } = await run(defaultPluginPath, [
      "--config",
      "./examples/simple/webpack.config.js",
    ]);
    expect(normalizeStdout(stdout2)).toContain("Hello World!");
  });
});
