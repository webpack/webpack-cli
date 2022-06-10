const tests = [
  require("./missing-packages/webpack-dev-server.test.js"),
  require("./missing-packages/webpack.test.js"),
  require("./missing-packages/webpack-bundle-analyzer.test.js"),
  require("./missing-command-packages/generator.test.js"),
  require("./missing-command-packages/serve.test.js"),
  require("./missing-command-packages/info.test.js"),
  require("./missing-command-packages/configtest.test.js"),
  require("./missing-packages/prettier.test.js"),
];

(async () => {
  let isAllPassed = true;
  const allResults = [];

  for await (const test of tests) {
    console.log(`\nRUN  ${test.name}`);

    let isPass = true;

    for await (const testCase of test.run) {
      isPass = isPass && (await testCase());
    }

    if (!isPass) {
      const result = `FAIL  ${test.name}`;
      allResults.push(result);
      console.log(result);
      isAllPassed = false;
    } else {
      const result = `PASS  ${test.name}`;
      allResults.push(result);
      console.log(result);
    }
  }

  console.log(`\n\nSummary of smoketest run:`);
  for (const result of allResults) {
    console.log(result);
  }

  if (!isAllPassed) {
    process.exit(2);
  }

  process.exit(0);
})();
