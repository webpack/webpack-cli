"use strict";

const { exec } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
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
 * @param {Array<string>=} args Array of arguments
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
      env: { WEBPACK_CLI_HELP_WIDTH: 1024 },
      ...options,
    },
  );
};

/**
 * Run the webpack CLI for a test case.
 * @param {string} cwd The path to folder that contains test
 * @param {Array<string>=} args Array of arguments
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
 * @param {Array<string>=} args Array of arguments
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
      proc.stdin.write(answers[currentAnswer]);
      currentAnswer++;
      waitAnswer = true;
    }
  };

  proc.stdout.pipe(
    new Writable({
      write(chunk, encoding, callback) {
        const output = chunk.toString("utf8");

        if (!output) {
          callback("No output");
          return;
        }

        const text = stripVTControlCharacters(output).trim();

        if (text.length > 0 && waitAnswer) {
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
const IPV6 = /([0-9a-f]){1,4}(:([0-9a-f]){1,4}){7}/gi;

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
  normalizedStderr = normalizedStderr.replaceAll(IPV6, "[x:x:x:x:x:x:x:x]");
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

const uniqueDirectoryForTest = async () => {
  const result = path.resolve(os.tmpdir(), uuid());

  if (!fs.existsSync(result)) {
    fs.mkdirSync(result);
  }

  return result;
};

module.exports = {
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
