import PluginGenerator from "@webpack-cli/generators/plugin-generator";
import * as yeoman from "yeoman-environment";

/**
 * Runs a yeoman generator to create a new webpack plugin project
 * @returns {void}
 */

export default function pluginCreator(): void {
	const env = yeoman.createEnv();
	const generatorName = "webpack-plugin-generator";

	env.registerStub(PluginGenerator, generatorName);

	env.run(generatorName);
}
