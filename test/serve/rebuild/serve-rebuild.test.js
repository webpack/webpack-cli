"use strict";

const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const [devServerVersion] = require("webpack-dev-server/package.json").version;
const { processKill, runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

const entryPath = resolve(__dirname, "./src/index.js");
const originalEntry = readFileSync(entryPath, "utf8");
const workerPath = resolve(__dirname, "./src/worker.js");
const originalWorker = readFileSync(workerPath, "utf8");

describe("serve recompilation", () => {
  let port;

  beforeEach(async () => {
    port = await (await getGetPort()).default();
  });

  afterEach(() => {
    writeFileSync(entryPath, originalEntry);
    writeFileSync(workerPath, originalWorker);
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

  it.each(["app", "worker"])(
    "should rebuild and serve changes to the %s compiler",
    async (name) => {
      let updatedBody;
      let requestError;
      const { stdout } = await runWatch(
        __dirname,
        ["serve", "--config", "multi.config.js", "--watch-options-stdin", "--port", port],
        {
          handler: (proc) => {
            let output = "";
            let serverOutput = "";
            let changed = false;
            let fetching = false;
            const check = () => {
              if (
                !changed &&
                output.includes("Built app") &&
                output.includes("Built worker") &&
                serverOutput.includes("Project is running at:")
              ) {
                changed = true;
                writeFileSync(
                  name === "app" ? entryPath : workerPath,
                  `console.log('updated ${name} bundle');\n`,
                );
              }

              if (!fetching && output.split(`Built ${name}`).length === 3) {
                fetching = true;
                fetch(`http://127.0.0.1:${port}/${name}.js`)
                  .then((response) => response.text())
                  .then((body) => {
                    updatedBody = body;
                  })
                  .catch((error) => {
                    requestError = error;
                  })
                  .finally(() => {
                    proc.stdin.end();
                  });
              }
            };

            proc.stdout.on("data", (chunk) => {
              output += chunk.toString();
              check();
            });
            proc.stderr.on("data", (chunk) => {
              serverOutput += chunk.toString();
              check();
            });
          },
        },
      );

      expect(requestError).toBeUndefined();
      expect(updatedBody).toContain(`updated ${name} bundle`);
      expect(stdout).toContain("Watch app: 10");
      expect(stdout).toContain("Watch worker: 30");
      if (devServerVersion !== "5") {
        expect(stdout.match(/Closed app/g)).toHaveLength(1);
        expect(stdout.match(/Closed worker/g)).toHaveLength(1);
      }
    },
  );
});
