const { runWatch } = require("../../utils/test-utils");

describe.each([false, true])("middleware stats (multi: %s)", (multi) => {
  it.each(["none", "false", "true", "assets", "fallback"])(
    "should respect %s stats",
    async (kind) => {
      const args = ["serve", "--watch-options-stdin", "--env", `kind=${kind}`];
      if (multi) {
        args.push("--env", "multi=true");
      }
      const { exitCode, stdout } = await runWatch(__dirname, args, {
        handler: (proc) => {
          let output = "";
          let stopping = false;
          proc.stderr.on("data", (chunk) => {
            output += chunk.toString();
            if (
              !stopping &&
              output.includes("Server ready") &&
              output.includes("Built first") &&
              (!multi || output.includes("Built second"))
            ) {
              stopping = true;
              proc.stdin.end();
            }
          });
        },
      });
      expect(exitCode).toBe(0);
      if (kind === "none" || kind === "false" || kind === "fallback") {
        expect(stdout).toBe("");
      } else {
        expect(stdout).toContain("first.js");
        if (multi) {
          expect(stdout).toContain("second.js");
        }
        if (kind === "assets") {
          expect(stdout).not.toContain("compiled successfully");
        } else {
          expect(stdout).toContain("compiled successfully");
        }
      }
    },
  );
});
