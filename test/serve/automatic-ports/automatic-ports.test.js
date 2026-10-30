/* eslint-disable jest/require-top-level-describe -- Version-gated describe */

const net = require("node:net");
const [devServerVersion] = require("webpack-dev-server/package.json").version;
const { runWatch } = require("../../utils/test-utils");

/**
 * Ports below the ephemeral ranges (32768+ on Linux, 49152+ on Windows and macOS), so outgoing
 * connections can't take the next ports, which the CLI picks for dev servers without a port
 * @returns {Promise<number>} free port
 */
const getFreePort = async () => {
  const { default: getPort, portNumbers } = await import("get-port");

  return getPort({ port: portNumbers(20000, 30000) });
};

const describeDevServer6 = devServerVersion === "5" ? describe.skip : describe;

describeDevServer6("automatic dev server ports", () => {
  let occupied;
  let basePort;

  beforeEach(async () => {
    occupied = net.createServer();
    basePort = await getFreePort();
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
      const explicitPort = await getFreePort();
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
          const stop = () => {
            stopping = true;
            proc.stdin.end();
          };

          proc.stdout.on("data", (chunk) => {
            output += chunk.toString();

            if (!stopping && [...output.matchAll(/Listening \d: \d+\n/g)].length === 2) {
              stop();
            }
          });
          // Fail fast when a server can't listen instead of waiting for the test timeout
          proc.stderr.on("data", (chunk) => {
            if (!stopping && chunk.toString().includes("EADDRINUSE")) {
              stop();
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
