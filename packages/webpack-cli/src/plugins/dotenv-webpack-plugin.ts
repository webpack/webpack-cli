import dotenv from "dotenv";
import { Compiler, DefinePlugin } from "webpack";

interface EnvVariables {
  [key: string]: string;
}
interface DotenvConfig {
  paths?: string[];
  prefixes?: string[];
  systemvars?: boolean;
  allowEmptyValues?: boolean;
  expand?: boolean;
  ignoreStub?: boolean;
  safe?: boolean;
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
  #options: DotenvConfig;
  #inputFileSystem!: any;
  #compiler!: Compiler;
  #logger: any;
  constructor(config: DotenvConfig) {
    this.#options = {
      prefixes: ["process.env.", "import.meta.env."],
      allowEmptyValues: true,
      expand: true,
      safe: true,
      paths: process.env.NODE_ENV
        ? [
            ".env",
            ...(process.env.NODE_ENV === "test" ? [] : [".env.local"]),
            `.env.[mode]`,
            `.env.[mode].local`,
          ]
        : [],
      ...config,
    };
  }

  public apply(compiler: Compiler): void {
    this.#inputFileSystem = compiler.inputFileSystem;
    this.#logger = compiler.getInfrastructureLogger("dotenv-webpack-plugin");
    this.#compiler = compiler;
    compiler.hooks.initialize.tap("dotenv-webpack-plugin", () => {
      const variables = this.#gatherVariables();
      const target: string =
        typeof compiler.options.target == "string" ? compiler.options.target : "";
      const data = this.#formatData({
        variables,
        target: target,
      });
      new DefinePlugin(data).apply(compiler);
    });
  }

  #gatherVariables(): EnvVariables {
    const { allowEmptyValues, safe } = this.#options;
    const vars: EnvVariables = this.#initializeVars();

    const { env, blueprint } = this.#getEnvs();

    Object.keys(blueprint).forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : env[key];

      if (
        (typeof value === "undefined" || value === null || (!allowEmptyValues && value === "")) &&
        safe
      ) {
        this.#logger.console.warn(`Missing environment variable: ${key}`);
      } else {
        vars[key] = value;
      }
      if (safe) {
        Object.keys(env).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(vars, key)) {
            vars[key] = env[key];
          }
        });
      }
    });

    return vars;
  }

  #initializeVars(): EnvVariables {
    return this.#options.systemvars
      ? Object.fromEntries(Object.entries(process.env).map(([key, value]) => [key, value ?? ""]))
      : {};
  }

  #getEnvs(): { env: EnvVariables; blueprint: EnvVariables } {
    const { paths, safe } = this.#options;

    const env: EnvVariables = {};
    let blueprint: EnvVariables = {};

    for (const path of paths || []) {
      const fileContent = this.#loadFile(
        path.replace("[mode]", `${process.env.NODE_ENV || this.#compiler.options.mode}`),
      );
      Object.assign(env, dotenv.parse(fileContent));
    }
    blueprint = env;
    if (safe) {
      for (const path of paths || []) {
        const exampleContent = this.#loadFile(
          `${path.replace(
            "[mode]",
            `${process.env.NODE_ENV || this.#compiler.options.mode}`,
          )}.example`,
        );
        blueprint = { ...blueprint, ...dotenv.parse(exampleContent) };
      }
    }
    return { env, blueprint };
  }

  #formatData({
    variables = {},
    target,
  }: {
    variables: EnvVariables;
    target: string;
  }): Record<string, string> {
    const { expand, prefixes } = this.#options;

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
    if (prefixes) {
      prefixes.forEach((prefix) => {
        Object.entries(preprocessedVariables).forEach(([key, value]) => {
          formatted[`${prefix}${key}`] = value;
        });
      });
    }

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
        this.#options.ignoreStub !== true &&
        (this.#options.ignoreStub === false ||
          (!target.includes("node") && !isMainThreadElectron(target))),
    );
  }

  #loadFile(filePath: string): Buffer | string {
    try {
      const fileContent = this.#inputFileSystem.readFileSync(filePath);
      // compilation.buildDependencies.add(filePath);
      return fileContent;
    } catch (err: any) {
      // compilation.missingDependencies.add(filePath);
      this.#logger.log(`Unable to upload ${filePath} file due:\n ${err.toString()}`);
      return "{}";
    }
  }
}

module.exports = Dotenv;
