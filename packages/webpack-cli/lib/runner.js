const execa = require('execa');
const cliPath = require.resolve('./bootstrap.js');

function runner(nodeArgs, cliArgs) {
    console.log({ nodeArgs, cliPath, cliArgs });
    console.log(['node', ...nodeArgs, cliPath, ...cliArgs].join(' '));
    execa('node', [...nodeArgs, cliPath, ...cliArgs], { stdio: 'inherit' }).catch((e) => {
        process.exit(e.exitCode);
    });
}

module.exports = runner;
