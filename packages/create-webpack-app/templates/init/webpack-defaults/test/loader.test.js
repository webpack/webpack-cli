import {
  compile,
  execute,
  getCompiler,
  getErrors,
  getWarnings,
  readAsset,
} from "./helpers";

describe("loader", () => {
  it("should work", async () => {
    const compiler = getCompiler("simple.js");
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats)),
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
