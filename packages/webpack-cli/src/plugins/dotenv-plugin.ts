import { Compiler, DefinePlugin } from "webpack";
import type { DotenvPluginOptions } from "../types";
import { EnvLoader } from "../utils/env-loader";

export class DotenvPlugin {
  logger!: ReturnType<Compiler["getInfrastructureLogger"]>;
  options: DotenvPluginOptions;

  constructor(options: DotenvPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    this.logger = compiler.getInfrastructureLogger("DotenvPlugin");

    try {
      const env = EnvLoader.loadEnvFiles({
        mode: process.env.NODE_ENV,
        prefixes: this.options.prefixes,
      });

      new DefinePlugin(
        Object.fromEntries(
          Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
        ),
      ).apply(compiler);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

module.exports = DotenvPlugin;
