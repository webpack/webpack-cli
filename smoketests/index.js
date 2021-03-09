/* eslint-disable node/no-unpublished-require */
const tests = [
    require('./missing-packages/webpack-dev-server.test.js'),
    require('./missing-packages/webpack.test.js'),
    require('./missing-command-help/generator.test.js'),
];

(async () => {
    let isAllPassed = true;
    for await (const test of tests) {
        console.log(`\nRUN  ${test.name}`);
        const isPass = await test.run();
        if (!isPass) {
            console.log(`FAIL  ${test.name}`);
            isAllPassed = false;
        } else {
            console.log(`PASS  ${test.name}`);
        }
    }
    if (!isAllPassed) {
        process.exit(2);
    }
    process.exit(0);
})();
