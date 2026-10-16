"use strict";

const { execFileSync } = require("node:child_process");
const { Worker } = require("node:worker_threads");

// `module.getCompileCacheDir` is only available on Node.js >= 22.8.0
const script = "(require('node:module').getCompileCacheDir || (() => null))() || null";

const child = execFileSync(process.execPath, ["-p", `JSON.stringify(${script})`], {
  encoding: "utf8",
});

new Worker(`require("node:worker_threads").parentPort.postMessage(${script})`, {
  eval: true,
}).once("message", (worker) => {
  process.stdout.write(
    `REPORT${JSON.stringify({
      variable: process.env.NODE_COMPILE_CACHE || null,
      child: JSON.parse(child),
      worker,
    })}\n`,
  );
  process.exit(0);
});
