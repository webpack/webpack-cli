"use strict";

const { exec } = require("node:child_process");
const fs = require("node:fs");
const { isIPv6 } = require("node:net");
const path = require("node:path");
const { stripVTControlCharacters } = require("node:util");
const concat = require("concat-stream");
const { Writable } = require("readable-stream");
const { cli } = require("webpack");

const WEBPACK_PATH = path.resolve(__dirname, "../../packages/webpack-cli/bin/cli.js");
const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;
const isWindows = process.platform === "win32";

const hyphenToUpperCase = (name) => {
  if (!name) {
    return name;
  }

  return name.replaceAll(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const processKill = (process) => {
  if (isWindows) {
    exec(`taskkill /pid ${process.pid} /T /F`);
  } else {
    process.kill();
  }
};

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {Record<string, any>} TestOptions */

/**
 * Webpack CLI test runner.
 * @param {import("execa")} execa execa API
 * @param {string} cwd The path to folder that contains test
 * @param {string[]=} args Array of arguments
 * @param {TestOptions=} options Options for tests
 * @returns {import("execa").Result} child process
 */
const createProcess = ({ execaNode, execa }, cwd, args, options) => {
  const { nodeOptions = [] } = options;
  const processExecutor = nodeOptions.length ? execaNode : execa;

  return processExecutor(
    typeof options.executorPath !== "undefined" ? options.executorPath : WEBPACK_PATH,
    args || [],
    {
      cwd: path.resolve(cwd),
      reject: false,
      stdio: ENABLE_LOG_COMPILATION ? "inherit" : "pipe",
      maxBuffer: Infinity,
      ...options,
    },
  );
};

/**
 * Run the webpack CLI for a test case.
 * @param {string} cwd The path to folder that contains test
 * @param {string[]=} args Array of arguments
 * @param {TestOptions=} options Options for tests
 * @returns {Promise<import("execa").Result>} child process
 */
const run = async (cwd, args = [], options = {}) => {
  const execa = await import("execa");
  return createProcess(execa, cwd, args, options);
};

/**
 * Run the webpack CLI in watch mode for a test case.
 * @param {string} cwd The path to folder that contains test
 * @param {string[]=} args Array of arguments
 * @param {TestOptions=} options Options for tests
 * @returns {Promise<import("execa").Result>} The webpack output or Promise when nodeOptions are present
 */
const runWatch = async (cwd, args = [], options = {}) => {
  const execa = await import("execa");
  const process = createProcess(execa, cwd, args, options);
  const outputKillStr = options.killString || /webpack \d+\.\d+\.\d/;
  const { stdoutKillStr } = options;
  const { stderrKillStr } = options;

  let isStdoutDone = false;
  let isStderrDone = false;

  if (options.handler) {
    options.handler(process);
  } else {
    process.stdout.pipe(
      new Writable({
        write(chunk, encoding, callback) {
          const output = stripVTControlCharacters(chunk.toString("utf8"));

          if (stdoutKillStr && stdoutKillStr.test(output)) {
            isStdoutDone = true;
          } else if (!stdoutKillStr && outputKillStr.test(output)) {
            processKill(process);
          }

          if (isStdoutDone && isStderrDone) {
            processKill(process);
          }

          callback();
        },
      }),
    );

    process.stderr.pipe(
      new Writable({
        write(chunk, encoding, callback) {
          const output = stripVTControlCharacters(chunk.toString("utf8"));

          if (stderrKillStr && stderrKillStr.test(output)) {
            isStderrDone = true;
          } else if (!stderrKillStr && outputKillStr.test(output)) {
            processKill(process);
          }

          if (isStdoutDone && isStderrDone) {
            processKill(process);
          }

          callback();
        },
      }),
    );
  }

  return process;
};

/**
 * runPromptWithAnswers
 * @param {string} cwd The path to folder that contains test
 * @param {string[]=} args CLI args to pass in
 * @param {string[]=} answers answers to be passed to stdout for inquirer question
 * @param {TestOptions=} options Options for tests
 * @returns {Promise<{ stdout: string, stderr: string }>} result
 */
const runPromptWithAnswers = async (cwd, args, answers = [], options = {}) => {
  const execa = await import("execa");
  const proc = createProcess(execa, cwd, args, {
    ...options,
    // TODO remove me when node@18 will be removed from support
    cleanup: false,
  });

  proc.stdin.setDefaultEncoding("utf8");

  let currentAnswer = 0;
  let waitAnswer = true;

  const writeAnswer = (output) => {
    if (answers.length === 0) {
      proc.stdin.write(output);
      processKill(proc);

      return;
    }

    if (currentAnswer < answers.length) {
      const answer = answers[currentAnswer];

      proc.stdin.write(answer);
      waitAnswer = true;
      currentAnswer++;
    }
  };

  // Uncomment for debugging
  // proc.stderr.pipe(process.stdout);

  proc.stdout.pipe(
    new Writable({
      write(chunk, encoding, callback) {
        const output = chunk.toString("utf8");

        if (!output) {
          callback("No output");
          return;
        }

        const text = stripVTControlCharacters(output).trim();

        if (text.length <= 0) {
          callback();
          return;
        }

        if (waitAnswer && /\(.+\)$/m.test(text)) {
          waitAnswer = false;
          writeAnswer(output);
        }

        callback();
      },
    }),
  );

  return new Promise((resolve) => {
    /** @type {{ stdout: string, stderr: string }} */
    const obj = {};

    let stdoutDone = false;
    let stderrDone = false;

    const complete = () => {
      if (stdoutDone && stderrDone) {
        processKill(proc);
        resolve(obj);
      }
    };

    proc.stdout.pipe(
      concat((result) => {
        stdoutDone = true;
        obj.stdout = result.toString();

        complete();
      }),
    );

    proc.stderr.pipe(
      concat((result) => {
        stderrDone = true;
        obj.stderr = result.toString();

        complete();
      }),
    );
  });
};

const normalizeVersions = (output) =>
  output.replaceAll(
    /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gi,
    "x.x.x",
  );

const normalizeCwd = (output) =>
  output
    .replaceAll("\\", "/")
    .replaceAll(new RegExp(process.cwd().replaceAll("\\", "/"), "g"), "<cwd>");

const normalizeError = (output) =>
  output
    .replace(/SyntaxError: .+/, "SyntaxError: <error-message>")
    .replaceAll(/\s+at .+(}|\)|\d)/gs, "\n    at stack");

const normalizeStdout = (stdout) => {
  if (typeof stdout !== "string") {
    return stdout;
  }

  if (stdout.length === 0) {
    return stdout;
  }

  let normalizedStdout = stripVTControlCharacters(stdout);
  normalizedStdout = normalizeCwd(normalizedStdout);
  normalizedStdout = normalizeVersions(normalizedStdout);
  normalizedStdout = normalizeError(normalizedStdout);

  return normalizedStdout;
};

const IPV4 = /(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}/g;
// A bracketed IPv6 host in a URL, in full or compressed ("::") form, e.g. a unique local
// address such as `[fdb2:2c26:f4e4::1]`. The loopback `[::1]` and bracketed text that is not
// an IPv6 address stay as they are.
const IPV6 = /\[([0-9a-f:.]+)(%[^\]]+)?\]/gi;
const replaceIPv6 = (match, address) =>
  address !== "::1" && isIPv6(address) ? "[x:x:x:x:x:x:x:x]" : match;

const normalizeStderr = (stderr) => {
  if (typeof stderr !== "string") {
    return stderr;
  }

  if (stderr.length === 0) {
    return stderr;
  }

  let normalizedStderr = stripVTControlCharacters(stderr);
  normalizedStderr = normalizeCwd(normalizedStderr);

  normalizedStderr = normalizedStderr.replaceAll(IPV4, "x.x.x.x");
  normalizedStderr = normalizedStderr.replaceAll(IPV6, replaceIPv6);
  normalizedStderr = normalizedStderr.replaceAll(/:[0-9]+\//g, ":<port>/");

  if (!/On Your Network \(IPv6\)/.test(stderr)) {
    // Github Actions doesn't' support IPv6 on ubuntu in some cases
    normalizedStderr = normalizedStderr.split("\n");

    const ipv4MessageIndex = normalizedStderr.findIndex((item) =>
      /On Your Network \(IPv4\)/.test(item),
    );

    if (ipv4MessageIndex !== -1) {
      normalizedStderr.splice(
        ipv4MessageIndex + 1,
        0,
        "<i> [webpack-dev-server] On Your Network (IPv6): http://[x:x:x:x:x:x:x:x]:<port>/",
      );
    }

    normalizedStderr = normalizedStderr.join("\n");
  }

  // the warning below is causing CI failure on some jobs
  if (/Gracefully shutting down/.test(stderr)) {
    normalizedStderr = normalizedStderr.replace(
      "\n<i> [webpack-dev-server] Gracefully shutting down. To force exit, press ^C again. Please wait...",
      "",
    );
  }

  normalizedStderr = normalizeVersions(normalizedStderr);
  normalizedStderr = normalizeError(normalizedStderr);

  return normalizedStderr;
};

const getWebpackCliArguments = (startWith) => {
  if (typeof startWith === "undefined") {
    return cli.getArguments();
  }

  const result = {};

  for (const [name, value] of Object.entries(cli.getArguments())) {
    if (name.startsWith(startWith)) {
      result[name] = value;
    }
  }

  return result;
};

const readFile = (path, options = {}) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats);
    });
  });

const readdir = (path) =>
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats);
    });
  });

// cSpell:ignore Symbhas, ABCDEFGHNR, Vfgcti
const urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";

const uuid = (size = 21) => {
  let id = "";
  let i = size;

  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0];
  }

  return id;
};

// Lines third-party code writes to stderr that say nothing about the CLI itself:
// - Node.js experimental warnings (e.g. webpack >= 5.110 strips types through
//   `module.stripTypeScriptTypes`, which Node.js flags as experimental)
// - Node.js core deprecations (`DEP0xxx`) raised inside dependencies
// - webpack infrastructure logs at info level (`<i> [plugin-name] ...`), which
//   plugins such as webpack-bundle-analyzer >= 5.4 print to stderr
// webpack's own deprecations (`DEP_WEBPACK_*`), warnings (`<w>`) and errors
// (`<e>`) are kept, so tests still catch the CLI misusing webpack.
// A warning message may span several lines. Node.js prints the `(Use node --trace-...)`
// hint only after the first warning of a process, so continuation lines are dropped
// only up to that hint, and never across a line that starts another record.
const NODE_WARNING_RE =
  /^\(node:\d+\) (?:ExperimentalWarning|\[DEP\d+\] DeprecationWarning):.*(?:(?:\r?\n(?!\(node:\d+\) |<[a-z]> |\[webpack)[^\r\n]*)*?\r?\n\(Use `node --trace-(?:warnings|deprecation) \.\.\.` to show where the warning was created\))?(?:\r?\n|$)/gm;
const INFRASTRUCTURE_INFO_RE = /^<i> .*(?:\r?\n|$)/gm;

/**
 * Strip third-party noise from stderr so assertions only see what the CLI reports.
 * @param {string} stderr stderr of a CLI run
 * @returns {string} stderr without third-party noise
 */
const cleanStderr = (stderr) =>
  typeof stderr === "string"
    ? stderr.replaceAll(NODE_WARNING_RE, "").replaceAll(INFRASTRUCTURE_INFO_RE, "").trim()
    : stderr;

/**
 * Get a free port for a dev server.
 *
 * A port from the OS comes from the ephemeral range, where outgoing connections (e.g. of
 * tests that install packages) can take it before the dev server listens, and Jest
 * workers running in parallel can get the same one. So each worker takes ports from its
 * own range below the ephemeral ones.
 * @returns {Promise<number>} free port
 */
const getFreePort = async () => {
  const { default: getPort, portNumbers } = await import("get-port");
  // 120 ranges keep ports below 32768, where the ephemeral range of Linux starts
  const from = 20000 + ((Number(process.env.JEST_WORKER_ID || 1) - 1) % 120) * 100;

  return getPort({ port: portNumbers(from, from + 99) });
};

const uniqueDirectoryForTest = async () => {
  const result = path.resolve(path.resolve(__dirname, "../create-webpack-app-testing"), uuid());

  if (!fs.existsSync(result)) {
    fs.mkdirSync(result, { recursive: true });
  }

  return result;
};

module.exports = {
  cleanStderr,
  getFreePort,
  getWebpackCliArguments,
  hyphenToUpperCase,
  isWindows,
  normalizeStderr,
  normalizeStdout,
  processKill,
  readFile,
  readdir,
  run,
  runPromptWithAnswers,
  runWatch,
  uniqueDirectoryForTest,
};
