import yeoman from "yeoman-environment";
import loaderGenerator from "./loader-generator";
import pluginGenerator from "./plugin-generator";
import addonGenerator from "./addon-generator";
import initGenerator from "./init-generator";
import type { InitOptions, LoaderOptions, PluginOptions } from "./types";
import { IWebpackCLI } from "webpack-cli";

class GeneratorsCommand {
  async apply(cli: IWebpackCLI): Promise<void> {
    await cli.makeCommand(
      {
        name: "init [generation-path]",
        alias: ["create", "new", "c", "n"],
        description: "Initialize a new webpack project.",
        argsDescription: {
          "generation-path": "Path to the installation directory, e.g. ./projectName",
        },
        usage: "[generation-path] [options]",
        pkg: "@webpack-cli/generators",
      },
      [
        {
          name: "template",
          alias: "t",
          configs: [{ type: "string" }],
          description: "Type of template",
          defaultValue: "default",
        },
        {
          name: "force",
          alias: "f",
          configs: [
            {
              type: "enum",
              values: [true],
            },
          ],
          description: "Generate without questions (ideally) using default answers",
        },
      ],
      async (generationPath: string, options: InitOptions) => {
        const cwd = generationPath || ".";
        const env = yeoman.createEnv([], { cwd });
        const generatorName = "webpack-init-generator";

        env.registerStub(initGenerator, generatorName);

        env.run(generatorName, { cli, options: { ...options, generationPath: cwd } }).then(
          () => {
            cli.logger.success("Project has been initialised with webpack!");
          },
          (error) => {
            cli.logger.error(`Failed to initialize the project.\n ${error}`);
            process.exit(2);
          },
        );
      },
    );

    await cli.makeCommand(
      {
        name: "loader [output-path]",
        alias: "l",
        description: "Scaffold a loader.",
        argsDescription: {
          "output-path": "Path to the output directory, e.g. ./loaderName",
        },
        usage: "[output-path] [options]",
        pkg: "@webpack-cli/generators",
      },
      [
        {
          name: "template",
          alias: "t",
          configs: [{ type: "string" }],
          description: "Type of template",
          defaultValue: "default",
        },
      ],
      async (outputPath: string, options: LoaderOptions) => {
        const cwd = outputPath || ".";
        const env = yeoman.createEnv([], { cwd });
        const generatorName = "webpack-loader-generator";

        env.registerStub(loaderGenerator, generatorName);

        env.run(generatorName, { cli, options: { ...options, generationPath: cwd } }).then(
          () => {
            cli.logger.success("Loader template has been successfully scaffolded.");
          },
          (error) => {
            cli.logger.error(`Failed to initialize the loader template.\n ${error}`);
            process.exit(2);
          },
        );
      },
    );

    await cli.makeCommand(
      {
        name: "plugin [output-path]",
        alias: "p",
        description: "Scaffold a plugin.",
        argsDescription: {
          "output-path": "Path to the output directory, e.g. ./pluginName",
        },
        usage: "[output-path] [options]",
        pkg: "@webpack-cli/generators",
      },
      [
        {
          name: "template",
          alias: "t",
          configs: [{ type: "string" }],
          description: "Type of template",
          defaultValue: "default",
        },
      ],
      async (outputPath: string, options: PluginOptions) => {
        const cwd = outputPath || ".";
        const env = yeoman.createEnv([], { cwd });
        const generatorName = "webpack-plugin-generator";

        env.registerStub(pluginGenerator, generatorName);

        env.run(generatorName, { cli, options: { ...options, generationPath: cwd } }).then(
          () => {
            cli.logger.success("Plugin template has been successfully scaffolded.");
          },
          (error) => {
            cli.logger.error(`Failed to initialize the plugin template.\n ${error}`);
            process.exit(2);
          },
        );
      },
    );
  }
}

export default GeneratorsCommand;
export { addonGenerator, initGenerator };
