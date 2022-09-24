jest.setTimeout(240000);

// Debug
console.log("NODE_PATH->", process.env.NODE_PATH);
if (!expect.getState().testPath.includes("colors.test.js")) {
  process.env.NO_COLOR = true;
}
