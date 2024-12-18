const fs = require("fs");
const { join } = require("path");
const collectTestFolders = require("./utils");

const outputDirectories = [
  "bin",
  "binary",
  "dist",
  "test",
  "test-assets",
  "test-plugin",
  "test-loader",
  "test-cache-path",
  "test-locate-cache",
  "stats.json",
];

const folderStrategy = (stats, file) => {
  return stats.isDirectory() && outputDirectories.includes(file);
};

const cleanupOutputDirs = () => {
  for (const outputFolder of collectTestFolders(folderStrategy)) {
    outputDirectories.forEach((dir) =>
      fs.rmSync(join(outputFolder, dir), { recursive: true, force: true }),
    );
  }
};

module.exports = cleanupOutputDirs;
