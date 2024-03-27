import dotenv from "dotenv-defaults";
import { Compiler, DefinePlugin } from "webpack";

interface EnvVariables {
  [key: string]: string;
}

interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface DotenvConfig {
  paths?: string[];
  prefixes?: string[];
  systemvars?: boolean;
  allowEmptyValues?: boolean;
  expand?: boolean;
  ignoreStub?: boolean;
  defaults?: boolean | string;
}

const interpolate = (env: string, vars: EnvVariables): string => {
  const matches = env.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];
  matches.forEach((match) => {
    env = env.replace(match, interpolate(vars[match.replace(/\$|{|}/g, "")] || "", vars));
  });
  return env;
};

const isMainThreadElectron = (target: string | undefined): boolean =>
  !!target && target.startsWith("electron") && target.endsWith("main");

export class Dotenv {
  private logger!: Logger;
  private config: DotenvConfig;
  private cache: Record<string, string>;
  private inputFileSystem: any;

  constructor(config: DotenvConfig = {}) {
    this.config = {
      paths: ["./.env"],
      prefixes: ["process.env.", "import.meta.env."],
      ...config,
    };
    this.cache = {};
  }

  public apply(compiler: Compiler): void {
    this.inputFileSystem = compiler.inputFileSystem;
    this.logger = compiler.getInfrastructureLogger("dotenv-webpack-plugin");
    const variables = this.gatherVariables();
    const target = compiler.options.target;
    const data = this.formatData({
      variables,
      target: typeof target === "boolean" ? undefined : target,
    });
    new DefinePlugin(data).apply(compiler);
  }
  private gatherVariables(): EnvVariables {
    const { allowEmptyValues } = this.config;
    const vars: EnvVariables = this.initializeVars();

    const { env, blueprint } = this.getEnvs();

    Object.keys(blueprint).forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : env[key];

      if (typeof value === "undefined" || value === null || (!allowEmptyValues && value === "")) {
        throw new Error(`Missing environment variable: ${key}`);
      } else {
        vars[key] = value;
      }
    });

    return vars;
  }

  private initializeVars(): EnvVariables {
    return this.config.systemvars
      ? Object.fromEntries(Object.entries(process.env).map(([key, value]) => [key, value ?? ""]))
      : {};
  }

  private getEnvs(): { env: EnvVariables; blueprint: EnvVariables } {
    const { paths } = this.config;

    const env: EnvVariables = {};

    (paths || ["./.env"]).forEach((path) =>
      Object.assign(env, dotenv.parse(this.loadFile(path || "./.env"))),
    );

    const blueprint: EnvVariables = env;

    return { env, blueprint };
  }

  private formatData({
    variables = {},
    target,
  }: {
    variables: EnvVariables;
    target: string | string[] | undefined;
  }): Record<string, string> {
    const { expand, prefixes } = this.config;

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
      prefixes?.includes("process.env.") && this.shouldStub({ target, prefix: "process.env." });
    if (shouldStubEnv) {
      formatted["process.env"] = '"MISSING_ENV_VAR"';
    }

    return formatted;
  }

  private shouldStub({
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
        this.config.ignoreStub !== true &&
        (this.config.ignoreStub === false ||
          (!target.includes("node") && !isMainThreadElectron(target))),
    );
  }

  private loadFile(filePath: string): string {
    if (this.cache[filePath]) {
      return this.cache[filePath];
    }
    try {
      const content = this.inputFileSystem.readFileSync(filePath, "utf8");
      this.cache[filePath] = content;
      return content;
    } catch (err) {
      return "{}";
    }
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
  }
}

module.exports = Dotenv;
