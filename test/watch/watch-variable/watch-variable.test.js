"use strict";

const { writeFileSync } = require("node:fs");
const path = require("node:path");
const { processKill, runWatch } = require("../../utils/test-utils");

const wordsInStatsv5 = ["asset", "index.js", "compiled successfully"];

describe("watch variable", () => {
  it("should pass `WEBPACK_WATCH` env variable and recompile upon file change using the `watch` command", async () => {
    let modified = false;

    await runWatch(__dirname, ["watch", "--mode", "development"], {
      handler: (proc) => {
        proc.stdout.on("data", (chunk) => {
          const data = chunk.toString();

          expect(data).not.toContain("FAIL");

          if (data.includes("index.js")) {
            for (const word of wordsInStatsv5) {
              expect(data).toContain(word);
            }

            if (!modified) {
              process.nextTick(() => {
                writeFileSync(
                  path.resolve(__dirname, "./src/index.js"),
                  "console.log('watch flag test');",
                );
              });

              modified = true;
            } else {
              processKill(proc);
            }
          }
        });
      },
    });

    expect(modified).toBe(true);
  });

  it("should pass `WEBPACK_WATCH` env variable and recompile upon file change using the `--watch` option", async () => {
    let modified = false;

    await runWatch(__dirname, ["--watch", "--mode", "development"], {
      handler: (proc) => {
        proc.stdout.on("data", (chunk) => {
          const data = chunk.toString();

          expect(data).not.toContain("FAIL");

          if (data.includes("index.js")) {
            for (const word of wordsInStatsv5) {
              expect(data).toContain(word);
            }

            if (!modified) {
              process.nextTick(() => {
                writeFileSync(
                  path.resolve(__dirname, "./src/index.js"),
                  "console.log('watch flag test');",
                );
              });

              modified = true;
            } else {
              processKill(proc);
            }
          }
        });
      },
    });

    expect(modified).toBe(true);
  });
});
