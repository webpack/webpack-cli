const { processKill, runWatch } = require("../../utils/test-utils");

describe("--watch-options-stdin", () => {
  it('should stop the process when stdin ends using "--watch" and "--watch-options-stdin" options', async () => {
    let semaphore = false;

    await runWatch(__dirname, ["--watch", "--watch-options-stdin"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it('should stop the process when stdin ends using the "watch" command and the "--watch-options-stdin" option', async () => {
    let semaphore = false;

    await runWatch(__dirname, ["watch", "--watch-options-stdin"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it("should stop the process when stdin ends using the config file", async () => {
    let semaphore = false;

    await runWatch(__dirname, ["--config", "./watch.config.js"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it("should stop the process when stdin ends using the config file in multi compiler mode", async () => {
    let semaphore = false;

    await runWatch(__dirname, ["--config", "./multi-watch.config.js"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it('should stop the process when stdin ends using the "serve" command and the "--watch-options-stdin" option', async () => {
    let semaphore = false;

    await runWatch(__dirname, ["serve", "--watch-options-stdin"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it('should stop the process when stdin ends using the "serve" command and the "--stdin" option', async () => {
    let semaphore = false;

    await runWatch(__dirname, ["serve", "--stdin"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it('should stop the process when stdin ends using the "serve" command and configuration', async () => {
    let semaphore = false;

    await runWatch(__dirname, ["serve", "--config", "./serve.config.js"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });

  it('should stop the process when stdin ends using the "serve" command and the config file in multi compiler mode', async () => {
    let semaphore = false;

    await runWatch(__dirname, ["--config", "./multi-watch.config.js"], {
      handler: (proc) => {
        proc.on("exit", () => {
          expect(semaphore).toBe(true);

          processKill(proc);
        });

        proc.stdin.end(() => {
          semaphore = true;
        });
      },
    });
  });
});
