const { writeFileSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const tsConfigPath = resolve(__dirname, "../tsconfig.json");
const tsConfigRaw = readFileSync(tsConfigPath);
const tsConfig = JSON.parse(tsConfigRaw);

tsConfig.compilerOptions.sourceMap = true;

writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
