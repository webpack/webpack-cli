jest.setTimeout(240000);

if (!expect.getState().testPath.includes("colors.test.js")) {
  process.env.NO_COLOR = true;
}
