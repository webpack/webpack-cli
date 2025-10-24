const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const tsConfigPath = resolve(__dirname, "../tsconfig.json");

try {
  const tsConfigRaw = readFileSync(tsConfigPath, "utf-8");
  const tsConfig = JSON.parse(tsConfigRaw);

  tsConfig.compilerOptions = tsConfig.compilerOptions || {};
  tsConfig.compilerOptions.sourceMap = true;

  writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2), "utf-8");
  console.log("tsconfig.json updated successfully with sourceMap enabled.");
} catch (error) {
  console.error("Failed to update tsconfig.json:", error.message);
}
