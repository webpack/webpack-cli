import { Compiler, DefinePlugin } from "webpack";
import type { DotenvPluginOptions } from "../types";
import { EnvLoader } from "../utils/env-loader";

export class DotenvPlugin {
  logger!: ReturnType<Compiler["getInfrastructureLogger"]>;
  options: DotenvPluginOptions;

  constructor(options: DotenvPluginOptions = {}) {
    this.options = options;
  }
  apply(compiler: Compiler) {
    this.logger = compiler.getInfrastructureLogger("DotenvPlugin");

    try {
      const env = EnvLoader.loadEnvFiles({
        mode: process.env.NODE_ENV,
        prefix: this.options.prefix,
        dir: this.options.dir,
      });
      const envObj = JSON.stringify(env);

      const runtimeEnvObject = `(() => {
          const env = ${envObj};
          // Make it read-only
          return Object.freeze(env);
        })()`;

      const definitions = {
        "process.env": envObj,
        ...Object.fromEntries(
          Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
        ),
        "import.meta.env": runtimeEnvObject,
        ...Object.fromEntries(
          Object.entries(env).map(([key, value]) => [
            `import.meta.env.${key}`,
            JSON.stringify(value),
          ]),
        ),
      };

      new DefinePlugin(definitions).apply(compiler);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

module.exports = DotenvPlugin;
