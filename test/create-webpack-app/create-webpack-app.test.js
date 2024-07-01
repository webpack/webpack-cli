const os = require("os");
const path = require("path");
const { mkdirSync, existsSync, readFileSync } = require("fs");
const { join, resolve } = require("path");
const { isWindows, run, runPromptWithAnswers, uniqueDirectoryForTest } = require("./test.utils");
const { profile, profileEnd, Console } = require("console");

// cspell: ignore gmrchk
jest.setTimeout(480000);

const ENTER = "\x0D";
const DOWN = "\x1B\x5B\x42";

const defaultProjectName = "webpack-project";

const defaultTemplateFiles = [
  "package.json",
  "package-lock.json",
  "src",
  "src/index.js",
  "webpack.config.js",
  "README.md",
];

// const reactTemplateFiles = [...defaultTemplateFiles, "index.html"];

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
  Object.keys(devDeps).forEach((dep) => (devDeps[dep] = "x.x.x"));

  return { ...pkgJSON, devDependencies: devDeps };
};

// Helper to read from webpack.config.js in a given path
const readFromWebpackConfig = (path) => readFileSync(join(path, "webpack.config.js"), "utf8");
afterEach(() => {
  jest.useRealTimers();
  jest.clearAllTimers();
});

describe("create-webpack-app cli", () => {
  it("should generate default project when nothing is passed", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout } = await run(assetsPath, ["init", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(projectFolder, file)).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });

  it("should generate project when generationPath is supplied", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await run(__dirname, ["init", assetsPath, "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    // expect(stderr).toContain("webpack.config.js");
    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });
  //
  it("should generate folders if non existing generation path is given", async () => {
    const assetsPath = path.resolve(os.tmpdir(), Date.now().toString());
    const { stdout, stderr } = await run(__dirname, ["init", assetsPath, "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");

    expect(stdout).toContain("webpack.config.js");
    const projectFolder = resolve(__dirname, assetsPath, defaultProjectName);

    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(join(projectFolder, file))).toBeTruthy();
    });

    //Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });
  // //
  it("should configure assets modules by default", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await run(assetsPath, ["init", "--force"]);

    const projectFolder = join(assetsPath, defaultProjectName);
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //   //
  //   // //   it("should ask question when wrong template is supplied", async () => {
  //   // //     const assetsPath = await uniqueDirectoryForTest();
  //   // //     const { stdout, stderr } = await runPromptWithAnswers(
  //   // //       assetsPath,
  //   // //       ["init", "--force", "--template=apple"],
  //   // //       [`${ENTER}`],
  //   // //     );
  //   // //
  //   // //     expect(stdout).toContain("Project has been initialised with webpack!");
  //   // //     expect(stderr).toContain("apple is not a valid template, please select one from below");
  //   // //     expect(stderr).toContain("webpack.config.js");
  //   // //
  //   // //     // Test files
  //   // //     defaultTemplateFiles.forEach((file) => {
  //   // //       expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
  //   // //     });
  //   // //
  //   // //     // Check if the generated package.json file content matches the snapshot
  //   // //     expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
  //   // //   });
  //   // //
  it("should generate typescript project correctly", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [`${DOWN}${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, `n${ENTER}`, ENTER, ENTER],
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
    const projectFolder = join(assetsPath, defaultProjectName);

    files.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  // //
  it("should generate ES6 project correctly", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [`${DOWN}${ENTER}`, `n${ENTER}`, `n${ENTER}`, `n${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");
    expect(stdout).toContain("babel.config.json");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    const files = [...defaultTemplateFiles, "babel.config.json"];

    files.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use sass in project when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${DOWN}${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use sass with postcss in project when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${DOWN}${ENTER}`,
        `n${ENTER}`,
        `y${ENTER}`,
        `n${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    const files = [...defaultTemplateFiles, "postcss.config.js"];

    files.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use mini-css-extract-plugin when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${DOWN}${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `y${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use sass and css with postcss in project when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${DOWN}${ENTER}`,
        `y${ENTER}`,
        `y${ENTER}`,
        `n${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    const files = [...defaultTemplateFiles, "postcss.config.js"];

    files.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use less in project when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${DOWN}${DOWN}${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use stylus in project when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${DOWN}${DOWN}${DOWN}${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should configure WDS as opted", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [ENTER, ENTER, `n${ENTER}`, `n${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Would you like to use Webpack Dev server?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);

    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });
  //
  it("should use postcss in project when selected", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [
        `${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `n${ENTER}`,
        `${DOWN}${ENTER}`,
        ENTER,
        `n${ENTER}`,
        ENTER,
      ],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    const files = [...defaultTemplateFiles, "postcss.config.js"];

    files.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });

  it("should configure html-webpack-plugin as opted", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [ENTER, `n${ENTER}`, ENTER, `n${ENTER}`, ENTER, ENTER],
    );

    expect(stdout).toContain("Do you want to simplify the creation of HTML files for your bundle?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });

  it("should configure workbox-webpack-plugin as opted", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [ENTER, `n${ENTER}`, ENTER, ENTER, ENTER, ENTER],
    );

    expect(stdout).toContain("Do you want to add PWA support?");
    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test file
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();

    // Check if the generated webpack configuration matches the snapshot
    expect(readFromWebpackConfig(projectFolder)).toMatchSnapshot();
  });

  it("should throw if the current path is not writable", async () => {
    if (isWindows) {
      return;
    }

    const assetsPath = await uniqueDirectoryForTest();
    const projectPath = join(assetsPath, "non-writable-path");

    mkdirSync(projectPath, 0o500);
    const { exitCode, stderr, stdout } = await run(projectPath, ["init", "my-app", "--force"], {
      reject: false,
    });
    expect(stderr).toContain("Failed to initialize the project with webpack!");
    expect(exitCode).toBe(2);
  });

  it("should work with 'new' alias", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await run(assetsPath, ["new", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });

  it("should work with 'create' alias", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await run(assetsPath, ["create", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });

  it("should work with 'c' alias", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await run(assetsPath, ["c", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });

  it("should work with 'n' alias", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await run(assetsPath, ["n", "--force"]);

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    defaultTemplateFiles.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });
  //   //
  //   // //   it("recognizes '-t' as an alias for '--template'", async () => {
  //   // //     const assetsPath = await uniqueDirectoryForTest();
  //   // //     const { stdout, stderr } = await run(assetsPath, ["init", "-t", "default", "--force"]);
  //   // //
  //   // //     expect(stdout).toContain("Project has been initialised with webpack!");
  //   // //     expect(stderr).toContain("webpack.config.js");
  //   // //
  //   // //     // Test files
  //   // //     defaultTemplateFiles.forEach((file) => {
  //   // //       expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
  //   // //     });
  //   // //
  //   // //     // Check if the generated package.json file content matches the snapshot
  //   // //     expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
  //   // //   });
  //   // //
  //   // //   it("recognizes '-f' as an alias for '--force'", async () => {
  //   // //     const assetsPath = await uniqueDirectoryForTest();
  //   // //     const { stdout, stderr } = await run(assetsPath, ["init", "-f"]);
  //   // //
  //   // //     expect(stdout).toContain("Project has been initialised with webpack!");
  //   // //     expect(stderr).toContain("webpack.config.js");
  //   // //
  //   // //     // Test files
  //   // //     defaultTemplateFiles.forEach((file) => {
  //   // //       expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
  //   // //     });
  //   // //
  //   // //     // Check if the generated package.json file content matches the snapshot
  //   // //     expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
  //   // //   });
  //   // //
  it("uses yarn as the package manager when opted", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout, stderr } = await runPromptWithAnswers(
      assetsPath,
      ["init", ".", defaultProjectName],
      [ENTER, `n${ENTER}`, `n${ENTER}`, `n${ENTER}`, ENTER, `${DOWN}${ENTER}`],
    );

    expect(stdout).toContain("Project has been initialised with webpack!");
    expect(stdout).toContain("webpack.config.js");

    const projectFolder = join(assetsPath, defaultProjectName);
    // Test files
    const files = [
      ...defaultTemplateFiles.filter((file) => file !== "package-lock.json"),
      "yarn.lock",
    ];

    files.forEach((file) => {
      expect(existsSync(resolve(projectFolder, file))).toBeTruthy();
    });

    // Check if the generated package.json file content matches the snapshot
    expect(readFromPkgJSON(projectFolder)).toMatchSnapshot();
  });

  //   // //   it("should generate react template with prompt answers", async () => {
  //   // //     const assetsPath = await uniqueDirectoryForTest();
  //   // //     const { stdout, stderr } = await runPromptWithAnswers(
  //   // //       assetsPath,
  //   // //       ["init"],
  //   // //       [ENTER, `y${ENTER}`, `${DOWN}${ENTER}`, `y${ENTER}`, ENTER, ENTER],
  //   // //     );
  //   // //
  //   // //     expect(stdout).toContain("Project has been initialised with webpack!");
  //   // //     expect(stderr).toContain("webpack.config.js");
  //   // //
  //   // //     // Test files
  //   // //     reactTemplateFiles.forEach((file) => {
  //   // //       expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
  //   // //     });
  //   // //
  //   // //     // Check if the generated package.json file content matches the snapshot
  //   // //     expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
  //   // //
  //   // //     // Check if the generated webpack configuration matches the snapshot
  //   // //     expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
  //   // //   });
  //   // //
  //   // //   it("should generate react template with --force", async () => {
  //   // //     const assetsPath = await uniqueDirectoryForTest();
  //   // //     const { stdout, stderr } = await run(assetsPath, ["init", "--template=react", "--force"]);
  //   // //
  //   // //     expect(stdout).toContain("Project has been initialised with webpack!");
  //   // //     expect(stderr).toContain("webpack.config.js");
  //   // //
  //   // //     // Test files
  //   // //     reactTemplateFiles.forEach((file) => {
  //   // //       expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
  //   // //     });
  //   // //
  //   // //     // Check if the generated package.json file content matches the snapshot
  //   // //     expect(readFromPkgJSON(assetsPath)).toMatchSnapshot();
  //   // //
  //   // //     // Check if the generated webpack configuration matches the snapshot
  //   // //     expect(readFromWebpackConfig(assetsPath)).toMatchSnapshot();
  //   // //   });
});
