import dotenv from "dotenv";
import { Compiler, DefinePlugin } from "webpack";

interface EnvVariables {
  [key: string]: string;
}

interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  log(message: string): void;
}

interface DotenvConfig {
  paths?: string[];
  prefixes?: string[];
  systemvars?: boolean;
  allowEmptyValues?: boolean;
  expand?: boolean;
  ignoreStub?: boolean;
}

const interpolate = (env: string, vars: EnvVariables): string => {
  const matches = env.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];
  matches.forEach((match) => {
    env = env.replace(match, interpolate(vars[match.replace(/\$|{|}/g, "")] || "", vars));
  });
  return env;
};

declare interface InputFileSystem {
  readFile: (
    arg0: string,
    arg1: (arg0?: null | NodeJS.ErrnoException, arg1?: string | Buffer) => void,
  ) => void;
}

const isMainThreadElectron = (target: string | undefined): boolean =>
  !!target && target.startsWith("electron") && target.endsWith("main");

export class Dotenv {
  #logger!: Logger;
  #config: DotenvConfig;
  #inputFileSystem!: InputFileSystem;

  constructor(config: DotenvConfig = {}) {
    this.#config = {
      paths: process.env.NODE_ENV
        ? [
            ".env",
            ...(process.env.NODE_ENV === "test" ? [] : [".env.local"]),
            `.env.${process.env.NODE_ENV}`,
            `.env.${process.env.NODE_ENV}.local`,
          ]
        : [],
      prefixes: ["process.env.", "import.meta.env."],
      allowEmptyValues: true,
      expand: true,
      ...config,
    };
  }

  public apply(compiler: Compiler): void {
    this.#inputFileSystem = compiler.inputFileSystem;
    this.#logger = compiler.getInfrastructureLogger("dotenv-webpack-plugin");
    if (!this.#config.paths) {
      this.#config.paths = [
        ".env",
        ".env.local",
        `.env.${compiler.options.mode}`,
        `.env.${compiler.options.mode}.local`,
      ];
    }
    compiler.hooks.thisCompilation.tap("dotenv-webpack-plugin", async (compilation) => {
      const cache = compilation.getCache("dotenv-webpack-plugin-compiler");
      if (await cache.getPromise("dotenv-webpack-plugin-data", null)) {
        new DefinePlugin(await cache.getPromise("dotenv-webpack-plugin-data", null)).apply(
          compiler,
        );
      } else {
        const variables = await this.#gatherVariables(compilation);
        const target: string =
          typeof compiler.options.target == "string" ? compiler.options.target : "";
        const data = this.#formatData({
          variables,
          target: target,
        });
        new DefinePlugin(data).apply(compiler);
        await cache.storePromise("dotenv-webpack-plugin-data", null, data);
      }
    });
  }
  async #gatherVariables(compilation: any): Promise<EnvVariables> {
    const { allowEmptyValues } = this.#config;
    const vars: EnvVariables = this.#initializeVars();

    const { env, blueprint } = await this.#getEnvs(compilation);

    Object.keys(blueprint).forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : env[key];

      if (typeof value === "undefined" || value === null || (!allowEmptyValues && value === "")) {
        compilation.errors.push(new Error(`Missing environment variable: ${key}`));
      } else {
        vars[key] = value;
      }
    });

    return vars;
  }

  #initializeVars(): EnvVariables {
    return this.#config.systemvars
      ? Object.fromEntries(Object.entries(process.env).map(([key, value]) => [key, value ?? ""]))
      : {};
  }

  #merge(apply = {}, defaults = {}) {
    Object.assign({}, defaults, apply);
  }

  #parse(src: string, defaultSrc = "") {
    const parsedSrc = dotenv.parse(src);
    const parsedDefault = dotenv.parse(defaultSrc);
    return this.#merge(parsedSrc, parsedDefault);
  }

  async #getEnvs(compilation: any): Promise<{ env: EnvVariables; blueprint: EnvVariables }> {
    const { paths } = this.#config;

    const env: EnvVariables = {};

    if (paths) {
      await paths.forEach(async (path) =>
        Object.assign(env, this.#parse(await this.#loadFile(path, compilation))),
      );
    } else {
      compilation.errors.push(new Error(`No paths in config.`));
    }

    const blueprint: EnvVariables = env;

    return { env, blueprint };
  }

  #formatData({
    variables = {},
    target,
  }: {
    variables: EnvVariables;
    target: string;
  }): Record<string, string> {
    const { expand, prefixes } = this.#config;

    const preprocessedVariables: EnvVariables = Object.keys(variables).reduce(
      (obj: EnvVariables, key: string) => {
        let value = variables[key];
        if (expand) {
          if (value.startsWith("\\$")) {
            value = value.substring(1);
          } else if (value.includes("\\$")) {
            value = value.replace(/\\\$/g, "$");
          } else {
            value = interpolate(value, variables);
          }
        }
        obj[key] = JSON.stringify(value);
        return obj;
      },
      {},
    );

    const formatted: Record<string, string> = {};
    prefixes?.forEach((prefix) => {
      Object.entries(preprocessedVariables).forEach(([key, value]) => {
        formatted[`${prefix}${key}`] = value;
      });
    });

    const shouldStubEnv =
      prefixes?.includes("process.env.") && this.#shouldStub({ target, prefix: "process.env." });
    if (shouldStubEnv) {
      formatted["process.env"] = '"MISSING_ENV_VAR"';
    }

    return formatted;
  }

  #shouldStub({
    target: targetInput,
    prefix,
  }: {
    target: string | string[] | undefined;
    prefix: string;
  }): boolean {
    const targets: string[] = Array.isArray(targetInput) ? targetInput : [targetInput || ""];

    return targets.every(
      (target) =>
        prefix === "process.env." &&
        this.#config.ignoreStub !== true &&
        (this.#config.ignoreStub === false ||
          (!target.includes("node") && !isMainThreadElectron(target))),
    );
  }

  async #loadFile(filePath: string, compilation: any): Promise<string> {
    compilation.fileDependencies.add(filePath);
    const fileContent = await new Promise<string>((resolve, reject) => {
      this.#inputFileSystem.readFile(
        filePath,
        (err?: null | NodeJS.ErrnoException, result?: string | Buffer) => {
          if (err) {
            compilation.missingDependencies.add(filePath);
            this.#logger.log(`Unable to upload ${filePath} file due:\n ${err.toString()}`);
            resolve("{}");
          } else {
            const content = result ? result.toString() : "{}";
            compilation.buildDependencies.add(filePath);
            resolve(content);
          }
        },
      );
    });
    return fileContent;
  }
}

module.exports = Dotenv;
