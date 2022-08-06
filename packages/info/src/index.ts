import envinfo from "envinfo";
import { IWebpackCLI } from "webpack-cli";

interface Information {
  Binaries?: string[];
  Browsers?: string[];
  Monorepos?: string[];
  System?: string[];
  npmGlobalPackages?: string[];
  npmPackages?: string | string[];
}

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
      [
        {
          name: "output",
          alias: "o",
          configs: [
            {
              type: "string",
            },
          ],
          description: "To get the output in a specified format ( accept json or markdown )",
        },
        {
          name: "additional-package",
          alias: "a",
          configs: [{ type: "string" }],
          multiple: true,
          description: "Adds additional packages to the output",
        },
      ],
      async (options: { output: string; additionalPackage: string[] }) => {
        let { output } = options;

        const envinfoConfig: { [key: string]: boolean } = {};

        if (output) {
          // Remove quotes if exist
          output = output.replace(/['"]+/g, "");

          switch (output) {
            case "markdown":
              envinfoConfig["markdown"] = true;
              break;
            case "json":
              envinfoConfig["json"] = true;
              break;
            default:
              cli.logger.error(`'${output}' is not a valid value for output`);
              process.exit(2);
          }
        }

        const defaultInformation: Information = {
          Binaries: ["Node", "Yarn", "npm"],
          Browsers: [
            "Brave Browser",
            "Chrome",
            "Chrome Canary",
            "Edge",
            "Firefox",
            "Firefox Developer Edition",
            "Firefox Nightly",
            "Internet Explorer",
            "Safari",
            "Safari Technology Preview",
          ],
          Monorepos: ["Yarn Workspaces", "Lerna"],
          System: ["OS", "CPU", "Memory"],
          npmGlobalPackages: ["webpack", "webpack-cli", "webpack-dev-server"],
        };

        let defaultPackages: string[] = ["webpack", "loader", "@webpack-cli/"];

        if (typeof options.additionalPackage !== "undefined") {
          defaultPackages = [...defaultPackages, ...options.additionalPackage];
        }

        defaultInformation.npmPackages = `{${defaultPackages
          .map((item) => `*${item}*`)
          .join(",")}}`;

        let info = await envinfo.run(defaultInformation, envinfoConfig);

        info = info.replace(/npmPackages/g, "Packages");
        info = info.replace(/npmGlobalPackages/g, "Global Packages");

        cli.logger.raw(info);
      },
    );
  }
}

export default InfoCommand;
