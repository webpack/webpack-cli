//eslint-disable-next-line node/no-unpublished-require
const { sync } = require('execa');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

try {
    const { stdout: cliOptions } = sync(resolve(__dirname, '../packages/webpack-cli/bin/cli.js'), ['--help=verbose'], {
        cwd: __dirname,
        reject: false,
    });

    // format output for markdown
    const mdContent = ['```\n', cliOptions, '\n```'].join('');

    // create OPTIONS.md
    writeFileSync('OPTIONS.md', mdContent);

    // serve options
    const { stdout: serveOptions } = sync(resolve(__dirname, '../packages/webpack-cli/bin/cli.js'), ['serve', '--help'], {
        cwd: __dirname,
        reject: false,
    });

    // format output for markdown
    const serveContent = ['```\n', serveOptions, '\n```'].join('');

    // create SERVE.md
    writeFileSync('SERVE-OPTIONS.md', serveContent);

    console.log('Successfully updated "OPTIONS.md" and "SERVE-OPTIONS.md"');
} catch (err) {
    console.error(err);
}
