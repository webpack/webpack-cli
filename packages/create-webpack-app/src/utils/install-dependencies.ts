import { type NodePlopAPI } from "node-plop";
import { dirname, resolve } from "node:path";
import { spawn } from "cross-spawn";
import {
  type ChildProcess,
  type SpawnOptionsWithStdioTuple,
  type StdioNull,
  type StdioPipe,
} from "node:child_process";
import { fileURLToPath } from "node:url";

export default async function installDependencies(plop: NodePlopAPI) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  plop.setPlopfilePath(resolve(__dirname, "../plopfile.js"));
  plop.setDefaultInclude({ actions: true });
  plop.setActionType("install-dependencies", (answers, config) => {
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
    const returnPromise = new Promise<string>((resolve, reject) => {
      const returnMessage = "Project dependencies installed successfully!";
      const { packageManager } = answers;
      const packages = config.packages.length === 1 ? [config.packages[0]] : config.packages;
      const installOptions: Record<string, string[]> = {
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
          reject(new Error(`Error occurred while installing packages\n Exit code: ${code}`));
        }
      });
    });
    return returnPromise;
  });
}
