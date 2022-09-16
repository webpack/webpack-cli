import { IWebpackCLI } from "webpack-cli";

class InfoCommand {
  async apply(cli: IWebpackCLI): Promise<void> {
    await cli.makeCommand(
      {
        name: "info",
        alias: "i",
        description: "Outputs information about your system.",
        usage: "[options]",
        pkg: "@webpack-cli/info",
      },
      cli.getInfoOptions(),
      async (options: { output: string; additionalPackage: string[] }) => {
        const info = await cli.getInfoOutput(options);

        cli.logger.raw(info);
      },
    );
  }
}

export default InfoCommand;
