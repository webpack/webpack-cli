const fs = require("node:fs");
const path = require("node:path");

const MAIN_CHANGELOG = path.join(process.cwd(), "packages/webpack-cli/CHANGELOG.md");
const ROOT_CHANGELOG = path.join(process.cwd(), "CHANGELOG.md");

const content = fs.readFileSync(MAIN_CHANGELOG, "utf8");

fs.writeFileSync(ROOT_CHANGELOG, content);

console.log("✅ Root CHANGELOG.md updated!");
