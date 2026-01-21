import {
  compile,
  execute,
  getCompiler,
  getErrors,
  getWarnings,
  readAsset,
} from "./helpers";

describe('"name" option', () => {
  it('should work with "Boolean" value equal "true"', async () => {
    const compiler = getCompiler("simple.js", {
      name: true,
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats)),
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
