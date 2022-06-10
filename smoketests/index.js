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
  const passResults = [];
  const failResults = [];

  for await (const test of tests) {
    console.log(`\nRUN  ${test.name}`);

    let isPass = true;

    for await (const testCase of test.run) {
      isPass = isPass && (await testCase());
    }

    if (!isPass) {
      const result = `FAIL  ${test.name}`;
      failResults.push(result);
      console.log(result);
      isAllPassed = false;
    } else {
      const result = `PASS  ${test.name}`;
      passResults.push(result);
      console.log(result);
    }
  }

  console.log(`\n\nSummary of smoketest run:`);
  console.log(`${failResults.length} tests failed, ${passResults.length} tests passed`);

  for (const result of failResults) {
    console.log(result);
  }
  for (const result of passResults) {
    console.log(result);
  }

  if (!isAllPassed) {
    process.exit(2);
  }

  process.exit(0);
})();
