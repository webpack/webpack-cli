const { writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { version } = require("webpack-dev-server/package.json");

const [majorDevServerVersion] = version.split(".");

/**
 * @returns {Promise<void>}
 */
async function updateDocs() {
  const { execaNode } = await import("execa");
  const { stdout: cliOptions } = await execaNode(
    resolve(__dirname, "../packages/webpack-cli/bin/cli.js"),
    ["--help=verbose", "--no-color"],
    {
      cwd: __dirname,
      nodeOptions: [`--import=${pathToFileURL(resolve(__dirname, "./set-blocking.js"))}`],
    },
  );

  // format output for markdown
  const mdContent = ["```\n", cliOptions, "\n```\n"].join("");

  // create OPTIONS.md
  writeFileSync("OPTIONS.md", mdContent);

  // serve options
  const { stdout: serveOptions } = await execaNode(
    resolve(__dirname, "../packages/webpack-cli/bin/cli.js"),
    ["serve", "--help", "--no-color"],
    {
      cwd: __dirname,
      nodeOptions: [`--import=${resolve(__dirname, "./set-blocking.js")}`],
    },
  );

  // format output for markdown
  const serveContent = ["```\n", serveOptions, "\n```\n"].join("");

  // create SERVE.md
  writeFileSync(`SERVE-OPTIONS-v${majorDevServerVersion}.md`, serveContent);

  console.log(`Successfully updated "OPTIONS.md" and "SERVE-OPTIONS-v${majorDevServerVersion}.md"`);
}

try {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  updateDocs();
} catch (err) {
  console.error(err);
}
