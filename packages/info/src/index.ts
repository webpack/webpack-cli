import { type IWebpackCLI } from "webpack-cli";

class InfoCommand {
  async apply(cli: IWebpackCLI): Promise<void> {
    await cli.makeCommand({
      name: "info",
      alias: ["i", "version", "v"],
      description: "Outputs information about your system.",
      options: cli.getInfoOptions().flatMap(cli.makeOption.bind(cli)),
      async action(options: { output: string; additionalPackage: string[] }) {
        const info = await cli.getInfoOutput(options);

        cli.logger.raw(info);
      },
    });
  }
}

export default InfoCommand;
