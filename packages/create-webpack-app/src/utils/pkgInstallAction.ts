// Cspell:ignore plopfile, plopfile.js
import { NodePlopAPI } from "../types";
import { dirname, resolve } from "path";
import { spawn } from "cross-spawn";
import { ChildProcess, SpawnOptionsWithStdioTuple, StdioNull, StdioPipe } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function (plop: NodePlopAPI) {
  plop.setPlopfilePath(resolve(__dirname, "../plopfile.js"));
  plop.setDefaultInclude({ actions: true });
  plop.setActionType("pkgInstall", (answers, config) => {
    const options: SpawnOptionsWithStdioTuple<
      StdioNull,
      StdioNull | StdioPipe,
      StdioPipe | StdioNull
    > = {
      cwd: config.path,
      stdio: [
        "inherit", // Use parent's stdio configuration
        process.stdout.isTTY ? "inherit" : "pipe", // Pipe child process' stdout to parent's stdout
        process.stderr.isTTY ? "inherit" : "pipe", // Pipe child process' stderr to parent's stderr
      ],
    };

    // promise to complete subprocess of installing packages and return a message
    const returnPromise: Promise<string> = new Promise((resolve, reject) => {
      const returnMessage = `Project Dependencies installed successfully`;
      const packageManager = answers.packageManager;
      const packages = config.packages.length == 1 ? [config.packages[0]] : config.packages;
      const installOptions: Record<string, Array<string>> = {
        npm: ["install", "--save-dev"],
        yarn: ["add", "-D"],
        pnpm: ["install", "--save-dev"],
      };
      const npmInstallPackages: ChildProcess = spawn(
        `${packageManager}`,
        [...installOptions[packageManager], ...packages],
        options,
      );
      npmInstallPackages.stdout?.on("data", (data) => {
        console.log(data.toString());
      });
      npmInstallPackages.stderr?.on("data", (data) => {
        console.warn(data.toString());
      });
      npmInstallPackages.on("exit", (code) => {
        if (code === 0) {
          resolve(returnMessage);
        } else {
          reject(`Error occurred while installing packages\n Exit code: ${code}`);
        }
      });
    });
    return returnPromise;
  });
}
