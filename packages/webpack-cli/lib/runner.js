const execa = require('execa');
const cliPath = require.resolve('./bootstrap.js');

function runner(nodeArgs, cliArgs) {
    execa("node", [...nodeArgs, cliPath, ...cliArgs], {stdio: 'inherit'}).catch(e => {
        process.exit(e.exitCode);
    });
}

module.exports = runner;
