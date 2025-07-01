const { writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { sync } = require("execa");
const { version } = require("webpack-dev-server/package.json");

const [majorDevServerVersion] = version.split(".");

try {
  const { stdout: cliOptions } = sync(
    resolve(__dirname, "../packages/webpack-cli/bin/cli.js"),
    ["--help=verbose", "--no-color"],
    {
      cwd: __dirname,
      reject: false,
    },
  );

  // format output for markdown
  const mdContent = ["```\n", cliOptions, "\n```"].join("");

  // create OPTIONS.md
  writeFileSync("OPTIONS.md", mdContent);

  // serve options
  const { stdout: serveOptions } = sync(
    resolve(__dirname, "../packages/webpack-cli/bin/cli.js"),
    ["serve", "--help", "--no-color"],
    {
      cwd: __dirname,
      reject: false,
    },
  );

  // format output for markdown
  const serveContent = ["```\n", serveOptions, "\n```"].join("");

  // create SERVE.md
  writeFileSync(`SERVE-OPTIONS-v${majorDevServerVersion}.md`, serveContent);

  console.log(`Successfully updated "OPTIONS.md" and "SERVE-OPTIONS-v${majorDevServerVersion}.md"`);
} catch (err) {
  console.error(err);
}
