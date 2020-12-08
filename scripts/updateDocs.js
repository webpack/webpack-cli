//eslint-disable-next-line node/no-unpublished-require
const { sync } = require('execa');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

const { stdout } = sync(resolve(__dirname, '../packages/webpack-cli/bin/cli.js'), ['--help=verbose'], {
    cwd: __dirname,
    reject: false,
});

// format output for markdown
const mdContent = ['```', stdout, '```'].join('');

try {
    // create OPTIONS.md
    writeFileSync('OPTIONS.md', mdContent);

    console.log('All options all sucessfylly stored in "OPTIONS.md"');
} catch (err) {
    console.error(err);
}
