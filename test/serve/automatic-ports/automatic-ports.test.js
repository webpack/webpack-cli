/* eslint-disable jest/require-top-level-describe -- Version-gated describe */

const net = require("node:net");
const [devServerVersion] = require("webpack-dev-server/package.json").version;
const { runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

const describeDevServer6 = devServerVersion === "5" ? describe.skip : describe;

describeDevServer6("automatic dev server ports", () => {
  let occupied;
  let basePort;

  beforeEach(async () => {
    occupied = net.createServer();
    basePort = await (await getGetPort()).default();
    await new Promise((resolve, reject) => {
      occupied.once("error", reject);
      occupied.listen(basePort, "127.0.0.1", resolve);
    });
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => {
      occupied.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test.each(["omitted", "auto", "explicit"])(
    "should assign distinct available ports with %s ports",
    async (mode) => {
      const explicitPort = await (await getGetPort()).default();
      const args = ["serve", "--watch-options-stdin"];

      if (mode === "auto") {
        args.push("--env", "auto=true");
      } else if (mode === "explicit") {
        args.push("--env", `explicit=${explicitPort}`);
      }

      const { exitCode, stdout, stderr } = await runWatch(__dirname, args, {
        env: {
          WEBPACK_DEV_SERVER_BASE_PORT: String(mode === "explicit" ? explicitPort : basePort),
        },
        handler: (proc) => {
          let output = "";
          let stopping = false;
          proc.stdout.on("data", (chunk) => {
            output += chunk.toString();

            if (!stopping && [...output.matchAll(/Listening \d: \d+\n/g)].length === 2) {
              stopping = true;
              proc.stdin.end();
            }
          });
        },
      });

      const ports = [...stdout.matchAll(/Listening \d: (\d+)/g)].map((match) => Number(match[1]));
      expect(exitCode).toBe(0);
      expect(ports).toHaveLength(2);
      expect(new Set(ports).size).toBe(2);
      expect(ports).not.toContain(basePort);
      expect(stderr).not.toContain("EADDRINUSE");

      if (mode === "explicit") {
        expect(ports).toContain(explicitPort);
      }
    },
  );
});
