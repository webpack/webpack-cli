const { existsSync, mkdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { join, resolve } = require("node:path");
const { createPathDependentUtils, isWindows, uniqueDirectoryForTest } = require("../test.utils");

// eslint-disable-next-line jest/no-confusing-set-timeout
jest.setTimeout(480000);

const { run, runPromptWithAnswers } = createPathDependentUtils("create-webpack-app");

const ENTER = "\u000D";
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

const reactTypescriptTemplateFiles = [
  ...defaultTemplateFiles.slice(0, 3),
  "src/index.tsx",
  ...defaultTemplateFiles.slice(4).filter((file) => file !== "webpack.config.js"),
  "webpack.config.ts",
  "tsconfig.json",
];

const vueTypescriptTemplateFiles = [
  ...defaultTemplateFiles.slice(0, 3),
  "src/main.ts",
  ...defaultTemplateFiles.slice(4).filter((file) => file !== "webpack.config.js"),
  "webpack.config.ts",
  "tsconfig.json",
];

const svelteTypescriptTemplateFiles = [
  ...defaultTemplateFiles.slice(0, 3),
  "src/main.ts",
  ...defaultTemplateFiles.slice(4).filter((file) => file !== "webpack.config.js"),
  "webpack.config.ts",
  "tsconfig.json",
  "src/store/index.ts",
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

// Helper to read from webpack.config.js or webpack.config.ts in a given path
const readFromWebpackConfig = (path, filename = "webpack.config.js") =>
  readFileSync(join(path, filename), "utf8");

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

  it("should generate default project when nothing is passed and override when content exist", async () => {
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

    const { stdout: nextStdout } = await run(dir, ["init", "--force"]);

    expect(nextStdout).toContain("Project has been initialised with webpack!");
    expect(nextStdout).toContain("webpack.config.js");
    // Test files
    for (const file of defaultTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should generate default project when nothing is passed and handle conflicts", async () => {
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

    const { stdout: nextStdout } = await runPromptWithAnswers(
      dir,
      ["init"],
      [
        `${DOWN}${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        ENTER,
        ENTER,
        // test for conflicts
        `y${ENTER}`,
        `n${ENTER}`,
        `a${ENTER}`,
      ],
    );

    expect(nextStdout).toContain("Project has been initialised with webpack!");
    expect(nextStdout).toContain("webpack.config.js");

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
      [`${DOWN}${DOWN}${ENTER}`, ENTER, `n${ENTER}`, `n${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("How should TypeScript be compiled?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.ts");
    expect(stdout).toContain("tsconfig.json");

    // Test files
    const files = [
      ...defaultTemplateFiles.filter(
        (file) => file !== "src/index.js" && file !== "webpack.config.js",
      ),
      "src/index.ts",
      "tsconfig.json",
      "webpack.config.ts",
    ];

    for (const file of files) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    // webpack strips the types itself, so the project carries no TypeScript loader
    const { devDependencies } = readFromPkgJSON(dir);

    expect(readFromWebpackConfig(dir, "webpack.config.ts")).not.toContain("ts-loader");
    expect(Object.keys(devDependencies)).not.toContain("ts-loader");
    expect(Object.keys(devDependencies)).toContain("typescript");

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir, "webpack.config.ts")).toMatchSnapshot();
  });

  it("should generate ES6 project correctly", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [`${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, ENTER, ENTER],
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

  it("should configure WDS as opted", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, ENTER, `n${ENTER}`, ENTER, ENTER],
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

  it("should not ask about HTML and CSS, which webpack supports out of the box", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, ENTER, ENTER, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).not.toContain(
      "Do you want to simplify the creation of HTML files for your bundle?",
    );
    expect(stdout).not.toContain("Which of the following CSS solution do you want to use?");
    expect(stdout).not.toContain("Will you be using CSS styles along with");
    expect(stdout).not.toContain("Do you want to use PostCSS in your project?");
    expect(stdout).not.toContain("Do you want to extract CSS into separate files?");

    // The page is the entry, and nothing loads HTML or CSS
    const config = readFromWebpackConfig(dir);

    expect(config).toContain('entry: { index: "./index.html" }');
    expect(config).not.toContain("html-webpack-plugin");
    expect(config).not.toContain('"css-loader"');
    expect(config).not.toContain("mini-css-extract-plugin");

    const { devDependencies } = readFromPkgJSON(dir);

    expect(Object.keys(devDependencies)).not.toContain("html-webpack-plugin");
    expect(Object.keys(devDependencies)).not.toContain("css-loader");
    expect(existsSync(resolve(dir, "src/styles.css"))).toBeTruthy();
    expect(existsSync(resolve(dir, "postcss.config.js"))).toBeFalsy();
  });

  it("should scaffold a preprocessor through the built-in CSS support when selected", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, `n${ENTER}`, `${DOWN}${DOWN}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Which CSS tool do you want to use?");
    expect(stdout).toContain("Project has been initialised with webpack!");

    // Sass is wired as a `css/auto` rule, so it needs no css-loader
    const config = readFromWebpackConfig(dir);

    expect(config).toContain('type: "css/auto"');
    expect(config).toContain('use: ["sass-loader"]');
    expect(config).not.toContain('"css-loader"');
    expect(existsSync(resolve(dir, "src/styles.scss"))).toBeTruthy();

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should scaffold PostCSS on top of the built-in CSS support when selected", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, `n${ENTER}`, `${DOWN}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");

    // A loader for `.css` turns the auto detection off, so the config asks for
    // the built-in CSS support explicitly
    const config = readFromWebpackConfig(dir);

    expect(config).toContain("experiments: {");
    expect(config).toContain("css: true");
    expect(config).toContain('use: ["postcss-loader"]');
    expect(config).not.toContain('"css-loader"');
    expect(existsSync(resolve(dir, "postcss.config.js"))).toBeTruthy();

    const { devDependencies } = readFromPkgJSON(dir);

    expect(Object.keys(devDependencies)).toContain("postcss-loader");
    expect(Object.keys(devDependencies)).toContain("autoprefixer");

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should chain PostCSS after a preprocessor when both are selected", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, `n${ENTER}`, `${DOWN}${DOWN}${DOWN}${ENTER}`, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");

    // `use` is applied right to left, so Sass compiles first and PostCSS runs over it
    const config = readFromWebpackConfig(dir);

    expect(config).toContain('use: ["postcss-loader", "sass-loader"]');
    expect(config).toContain('use: ["postcss-loader"]');
    expect(config).toContain("css: true");
    expect(existsSync(resolve(dir, "src/styles.scss"))).toBeTruthy();
    expect(existsSync(resolve(dir, "postcss.config.js"))).toBeTruthy();

    const { devDependencies } = readFromPkgJSON(dir);

    expect(Object.keys(devDependencies)).toContain("sass-loader");
    expect(Object.keys(devDependencies)).toContain("postcss-loader");

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(dir)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(dir)).toMatchSnapshot();
  });

  it("should configure workbox-webpack-plugin as opted", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", "."],
      [ENTER, `n${ENTER}`, ENTER, ENTER, ENTER],
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
      [ENTER, `n${ENTER}`, `n${ENTER}`, ENTER, `${DOWN}${ENTER}`],
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
      [ENTER, `y${ENTER}`, `y${ENTER}`, ENTER, ENTER],
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

  it("should generate react template with typescript", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=react"],
      [`${DOWN}${ENTER}`, `y${ENTER}`, `y${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.ts");

    for (const file of reactTypescriptTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    expect(readFromPkgJSON(dir)).toMatchSnapshot();
    expect(readFromWebpackConfig(dir, "webpack.config.ts")).toMatchSnapshot();
  });

  it("should generate vue template with store and router support on prompt answers", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=vue"],
      [ENTER, `y${ENTER}`, `y${ENTER}`, ENTER, ENTER],
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

  it("should generate vue template with typescript", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=vue"],
      [`${DOWN}${ENTER}`, `y${ENTER}`, `y${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.ts");

    for (const file of vueTypescriptTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    expect(readFromPkgJSON(dir)).toMatchSnapshot();
    expect(readFromWebpackConfig(dir, "webpack.config.ts")).toMatchSnapshot();
  });

  it("should generate svelte template with prompt answers", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=svelte"],
      [ENTER, `y${ENTER}`, ENTER, ENTER],
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

  it("should generate svelte template with typescript", async () => {
    const { stdout } = await runPromptWithAnswers(
      dir,
      ["init", ".", "--template=svelte"],
      [`${DOWN}${ENTER}`, `y${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.ts");

    for (const file of svelteTypescriptTemplateFiles) {
      expect(existsSync(resolve(dir, file))).toBeTruthy();
    }

    expect(readFromPkgJSON(dir)).toMatchSnapshot();
    expect(readFromWebpackConfig(dir, "webpack.config.ts")).toMatchSnapshot();
  });
});
