const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { cp } = require("node:fs/promises");
const path = require("node:path");
const { join, resolve } = require("node:path");
const { createPathDependentUtils, isWindows, uniqueDirectoryForTest } = require("../test.utils");

// eslint-disable-next-line jest/no-confusing-set-timeout
jest.setTimeout(480000);

const { run, runPromptWithAnswers } = createPathDependentUtils("create-webpack-app");

const ENTER = "\u000D";
const UP = "\u001B\u005B\u0041";
const DOWN = "\u001B\u005B\u0042";

const defaultTemplateFiles = [
  "package.json",
  "package-lock.json",
  "src",
  "src/index.js",
  "webpack.config.js",
  "README.md",
];

const reactTemplateFiles = [
  ...defaultTemplateFiles.slice(0, 3),
  "src/index.jsx",
  ...defaultTemplateFiles.slice(4),
];

const vueTemplateFiles = [
  ...defaultTemplateFiles.slice(0, 3),
  "src/main.js",
  ...defaultTemplateFiles.slice(4),
];

const svelteTemplateFiles = [
  ...defaultTemplateFiles.slice(0, 3),
  "src/main.js",
  ...defaultTemplateFiles.slice(4),
  "src/store/index.js",
];

// helper function to resolve the path from the test directory to actual assets
// Helper to read from package.json in a given path
const readFromPkgJSON = (path) => {
  const pkgJSONPath = join(path, "package.json");

  if (!existsSync(pkgJSONPath)) {
    return {};
  }

  const pkgJSON = JSON.parse(readFileSync(pkgJSONPath, "utf8"));
  const { devDependencies: devDeps } = pkgJSON;

  // Update devDeps versions to be x.x.x to prevent frequent snapshot updates
  for (const dep of Object.keys(devDeps)) devDeps[dep] = "x.x.x";

  return { ...pkgJSON, devDependencies: devDeps };
};

// Helper to read from webpack.config.js in a given path
const readFromWebpackConfig = (path) => readFileSync(join(path, "webpack.config.js"), "utf8");

describe("create-webpack-app cli", () => {
  let dir;

  beforeEach(async () => {
    dir = await uniqueDirectoryForTest();
  });

  it("should generate default project when nothing is passed", async () => {
    const { stdout } = await run(dir, ["init", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");
    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should generate project when generationPath is supplied", async () => {
    const { stdout } = await run(__dirname, ["init", dir, "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();
  });

  it("should generate folders if non existing generation path is given", async () => {
    const assetsPath = path.resolve(
      __dirname,
      "../create-webpack-app-testing",
      Date.now().toString(),
    );
    const { stdout } = await run(__dirname, ["init", assetsPath, "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(join(assetsPath, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
  });

  it("should throw if the current path is not writable", async () => {
    if (isWindows) {
      return;
    }

    const projectPath = join(dir, "non-writable-path");

    mkdirSync(projectPath, 0o500);

    const { exitCode, stderr } = await run(projectPath, ["init", "my-app", "--force"], {
      reject: false,
    });

    expect(stderr).toContain("Failed to initialize the project with webpack!");
    expect(exitCode).toBe(2);
  });

  // We support more aliases - new/n and create/c, but to make tests faster we test only one alias
  it("should work with 'new' alias", async () => {
    const { stdout } = await run(dir, ["new", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();
  });

  it("recognizes '-t' as an alias for '--template' and '-f' as an alias for '--force'", async () => {
    const { stdout } = await run(dir, ["init", "-t", "default", "-f"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();
  });

  it("should ask question when wrong template is supplied", async () => {
    const { stdout, stderr } = await runPromptWithAnswers(
      dir,
      ["init", "--force", "--template=apple"],
      [ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stderr).toContain("apple is not a valid template, please select one from below");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();
  });

  it("should generate typescript project correctly", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [`${DOWN}${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${UP}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");
    expect(stdout).toContain("tsconfig.json");

    // Test files
    const files = [
      ...defaultTemplateFiles.filter((file) => file !== "src/index.js"),
      "src/index.ts",
      "tsconfig.json",
    ];

    for (const file of files) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should generate ES6 project correctly", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [`${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${UP}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");
    expect(stdout).toContain("babel.config.json");

    // Test files
    const files = [...defaultTemplateFiles, "babel.config.json"];

    for (const file of files) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should use to use css preprocessor with postcss with mini-css-extract-plugin in project when selected", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [
        ENTER,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${ENTER}`,
        `n${ENTER}`,
        `y${ENTER}`,
        ENTER,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should use css preprocessor and css with postcss in project when selected", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${ENTER}`,
        `y${ENTER}`,
        `y${ENTER}`,
        ENTER,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    const files = [...defaultTemplateFiles, "postcss.config.js"];

    for (const file of files) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should configure WDS as opted", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, ENTER, `n${ENTER}`, `n${ENTER}`, `${UP}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Would you like to use Webpack Dev server?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should configure html-webpack-plugin as opted", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, ENTER, `n${ENTER}`, `${UP}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Do you want to simplify the creation of HTML files for your bundle?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should configure workbox-webpack-plugin as opted", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, ENTER, ENTER, `${UP}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Do you want to add PWA support?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test file
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("uses yarn as the package manager when opted", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, `n${ENTER}`, `n${ENTER}`, `${UP}${ENTER}`, `${DOWN}${ENTER}`],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    const files = [
      ...defaultTemplateFiles.filter((file) => file !== "package-lock.json"),
      "yarn.lock",
    ];

    for (const file of files) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();
  });

  it("should generate react template with state and routing support with prompt answers", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=react"],
      [ENTER, `y${ENTER}`, `y${ENTER}`, ENTER, `y${ENTER}`, ENTER, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of reactTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should generate vue template with store and router support on prompt answers", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=vue"],
      [ENTER, `y${ENTER}`, `y${ENTER}`, `${ENTER}`, `y${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const files = [...vueTemplateFiles, "src/store/index.js"];

    // Test files
    for (const file of files) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should generate svelte template with prompt answers", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=svelte"],
      [ENTER, `y${ENTER}`, ENTER, `y${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    // Test files
    for (const file of svelteTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });
});
