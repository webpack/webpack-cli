"use strict";

const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { processKill, runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

const entryPath = resolve(__dirname, "./src/index.js");
const originalEntry = readFileSync(entryPath, "utf8");

describe("serve recompilation", () => {
  let port;

  beforeEach(async () => {
    port = await (await getGetPort()).default();
  });

  afterEach(() => {
    writeFileSync(entryPath, originalEntry);
  });

  it("should recompile upon file change and log the stats again", async () => {
    let compilations = 0;

    await runWatch(__dirname, ["serve", "--mode", "development", "--port", port], {
      handler: (proc) => {
        proc.stdout.on("data", (chunk) => {
          const data = chunk.toString();

          if (!data.includes("compiled successfully")) {
            return;
          }

          compilations += 1;

          if (compilations === 1) {
            process.nextTick(() => {
              writeFileSync(entryPath, originalEntry);
            });
          } else {
            processKill(proc);
          }
        });
      },
    });

    expect(compilations).toBe(2);
  });

  it("should serve the updated bundle from memory after recompiling", async () => {
    let compilations = 0;
    let updatedBody;

    await runWatch(__dirname, ["serve", "--mode", "development", "--port", port], {
      handler: (proc) => {
        proc.stdout.on("data", (chunk) => {
          const data = chunk.toString();

          if (!data.includes("compiled successfully")) {
            return;
          }

          compilations += 1;

          if (compilations === 1) {
            process.nextTick(() => {
              writeFileSync(entryPath, "console.log('serve rebuild test updated');\n");
            });
          } else {
            fetch(`http://127.0.0.1:${port}/main.js`)
              .then((response) => response.text())
              .then((body) => {
                updatedBody = body;
              })
              .finally(() => {
                processKill(proc);
              });
          }
        });
      },
    });

    expect(updatedBody).toContain("serve rebuild test updated");
  });

  it("should watch every compiler of a multi compiler with its own watch options", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "multi.config.js", "--port", port],
      {
        stdoutKillStr: /compiled successfully/,
        stderrKillStr: /Project is running at:/,
      },
    );

    expect(stdout).toContain("app:");
    expect(stdout).toContain("worker:");
    expect(stderr).toContain("Project is running at:");
  });
});
