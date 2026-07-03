"use strict";

const { processKill, runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

describe("serve with multiple compilers and unique public paths", () => {
  let port;

  beforeEach(async () => {
    port = await (await getGetPort()).default();
  });

  it("should serve all compilers from a single port", async () => {
    let loginBody;
    let adminBody;

    await runWatch(__dirname, ["serve", "--port", port], {
      handler: (proc) => {
        proc.stderr.on("data", (chunk) => {
          const data = chunk.toString();

          if (!data.includes("Project is running at:")) {
            return;
          }

          Promise.all([
            fetch(`http://127.0.0.1:${port}/login/login.js`).then((response) => response.text()),
            fetch(`http://127.0.0.1:${port}/admin/admin.js`).then((response) => response.text()),
          ])
            .then(([login, admin]) => {
              loginBody = login;
              adminBody = admin;
            })
            .finally(() => {
              processKill(proc);
            });
        });
      },
    });

    expect(loginBody).toContain("login-app");
    expect(adminBody).toContain("admin-app");
  });
});
