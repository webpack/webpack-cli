const WEBPACK_PACKAGE = process.env.WEBPACK_PACKAGE || "webpack";

class ConfigTestCommand {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async apply(cli: any): Promise<void> {
    await cli.makeCommand(
      {
        name: "configtest [config-path]",
        alias: "t",
        description: "Validate a webpack configuration.",
        pkg: "@webpack-cli/configtest",
        dependencies: [WEBPACK_PACKAGE],
      },
      [],
      async (configPath: string | undefined): Promise<void> => {
        cli.webpack = await cli.loadWebpack();

        const config = await cli.loadConfig(configPath ? { config: [configPath] } : {});
        const configPaths = new Set<string>();

        if (Array.isArray(config.options)) {
          config.options.forEach((options) => {
            if (config.path.get(options)) {
              configPaths.add(config.path.get(options));
            }
          });
        } else {
          if (config.path.get(config.options)) {
            configPaths.add(config.path.get(config.options));
          }
        }

        if (configPaths.size === 0) {
          cli.logger.error("No configuration found.");
          process.exit(2);
        }

        cli.logger.info(`Validate '${Array.from(configPaths).join(" ,")}'.`);

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const error: any = cli.webpack.validate(config.options);

          // TODO remove this after drop webpack@4
          if (error && error.length > 0) {
            throw new cli.webpack.WebpackOptionsValidationError(error);
          }
        } catch (error) {
          if (cli.isValidationError(error)) {
            cli.logger.error((error as Error).message);
          } else {
            cli.logger.error(error);
          }

          process.exit(2);
        }

        cli.logger.success("There are no validation errors in the given webpack configuration.");
      },
    );
  }
}

export default ConfigTestCommand;
