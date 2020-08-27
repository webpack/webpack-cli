const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const n_iterations = process.argv.length > 2 ? process.argv[2] : 100;

// eslint-disable-next-line
const fsPromises = fs.promises;

async function runSmokeTests() {
    const rootFiles = await fsPromises.readdir(__dirname);
    let testFiles = [];
    // eslint-disable-next-line
    for await(let parentDir of rootFiles) {
        const parentDirectoryName = path.join(__dirname, parentDir);
        const statFile = await fsPromises.lstat(parentDirectoryName);
        // eslint-disable-next-line
        if(statFile.isDirectory()) {
            const childFiles = await fsPromises.readdir(parentDirectoryName);
            // eslint-disable-next-line
            for await(let testFile of childFiles) {
                // eslint-disable-next-line
                if(~testFile.indexOf('smoketest')) {
                    const testPath = path.join(parentDirectoryName, testFile);
                    testFiles.push(testPath);
                }
            }
        }
    }
    // eslint-disable-next-line
    for(let k_iters = 0; k_iters < n_iterations; k_iters++) {
        (async function (k_iters) {
            for (let testPath of testFiles) {
                console.log(`\n============================ ${testPath} - ${k_iters + 1} / ${n_iterations} ============================\n`);
                const testProc = spawn(testPath);
                testProc.stdout.on('data', (data) => {
                    console.log(data.toString());
                });

                testProc.stderr.on('data', (data) => {
                    console.error(data.toString());
                });
            }
        })(k_iters);
    }
}
runSmokeTests();
