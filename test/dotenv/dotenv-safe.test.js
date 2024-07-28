"use strict";

const { run } = require("../utils/test-utils");
const path = require("path");
const fs = require("fs");

describe("dotenv", () => {
  const testDirectory = path.join(__dirname, "test-dot-env");
  const outputFile = path.join(testDirectory, "output.js");

  beforeAll(async () => {
    if (!fs.existsSync(testDirectory)) {
      fs.mkdirSync(testDirectory);
    }
    await fs.promises.writeFile(
      path.join(testDirectory, "webpack.config.js"),
      `
          const path = require('path');
          module.exports = {
            entry: './index.js',
            output: {
              path: path.resolve(__dirname),
              filename: 'output.js'
            },
          };
        `,
    );
    await fs.promises.writeFile(
      path.join(testDirectory, "index.js"),
      "module.exports = import.meta.env.TEST_VARIABLE;",
    );
    await fs.promises.writeFile(path.join(testDirectory, ".env"), "TEST_VARIABLE=12345");
    await fs.promises.writeFile(
      path.join(testDirectory, ".env.example"),
      "TEST_VARIABLE=\nUN_DECLARED_VARIABLE=",
    );
  });

  afterAll(() => {
    fs.unlinkSync(path.join(testDirectory, "webpack.config.js"));
    fs.unlinkSync(path.join(testDirectory, "index.js"));
    fs.unlinkSync(path.join(testDirectory, ".env"));
    fs.unlinkSync(path.join(testDirectory, ".env.example"));
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    fs.rmdirSync(testDirectory);
  });

  it("should refer to the example file", async () => {
    await expect(run(testDirectory, ["--dot-env"])).resolves.toThrow(
      "Missing environment variable: UN_DECLARED_VARIABLE",
    );
  });
});
