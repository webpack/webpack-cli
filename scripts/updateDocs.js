//eslint-disable-next-line node/no-unpublished-require
const { sync } = require('execa');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

try {
    const { stdout } = sync(resolve(__dirname, '../packages/webpack-cli/bin/cli.js'), ['--help=verbose'], {
        cwd: __dirname,
        reject: false,
    });

    // format output for markdown
    const mdContent = ['```\n', stdout, '\n```'].join('');

    // create OPTIONS.md
    writeFileSync('OPTIONS.md', mdContent);

    console.log('All options all successfully stored in "OPTIONS.md"');
} catch (err) {
    console.error(err);
}
