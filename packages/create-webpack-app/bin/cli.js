import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import { Plop, run } from "plop";
// cSpell:ignore plopfile, plopfile.js
const args = process.argv.slice(2);
const argv = minimist(args);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Plop.prepare(
  {
    cwd: argv.cwd,
    configPath: path.resolve(__dirname, "../lib/plopfile.js"),
    preload: argv.preload || [],
    completion: argv.completion,
  },
  (env) => Plop.execute(env, run),
);
