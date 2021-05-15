import envinfo from "envinfo";

interface Information {
    Binaries?: string[];
    Browsers?: string[];
    Monorepos?: string[];
    System?: string[];
    npmGlobalPackages?: string[];
    npmPackages?: string | string[];
}

const DEFAULT_DETAILS: Information = {
    Binaries: ["Node", "Yarn", "npm"],
    Browsers: ["Brave Browser", "Chrome", "Chrome Canary", "Edge", "Firefox", "Firefox Developer Edition", "Firefox Nightly", "Internet Explorer", "Safari", "Safari Technology Preview"],
    Monorepos: ["Yarn Workspaces", "Lerna"],
    System: ["OS", "CPU", "Memory"],
    npmGlobalPackages: ["webpack", "webpack-cli"],
    npmPackages: "*webpack*",
};

class InfoCommand {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async apply(cli: any): Promise<void> {
        const { logger } = cli;

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
            ],
            async (options) => {
                let { output } = options;

                const envinfoConfig = {};

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
                            logger.error(`'${output}' is not a valid value for output`);
                            process.exit(2);
                    }
                }

                let info = await envinfo.run(DEFAULT_DETAILS, envinfoConfig);

                info = info.replace(/npmPackages/g, "Packages");
                info = info.replace(/npmGlobalPackages/g, "Global Packages");

                logger.raw(info);
            },
        );
    }
}

export default InfoCommand;
