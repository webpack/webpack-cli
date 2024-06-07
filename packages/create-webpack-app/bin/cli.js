import { Command } from "commander";
const program = new Command();

import pkg from "../package.json" with { type: "json" };

program.version(pkg.version, "-v, --version");
program.helpOption("-h, --help", "Display help for command");

program
  .option("-s, --skip", "Skip the prompt and use the default values")
  .option("-f, --force", "Force the generator actions to override existing files");

program.parse(process.argv);

console.log(program.opts());
