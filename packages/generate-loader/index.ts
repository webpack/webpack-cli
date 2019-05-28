import LoaderGenerator from "@webpack-cli/generators/loader-generator";
import * as yeoman from "yeoman-environment";

/**
 * Runs a yeoman generator to create a new webpack loader project
 * @returns {void}
 */

export default function loaderCreator(): void {
	const env = yeoman.createEnv();
	const generatorName = "webpack-loader-generator";

	env.registerStub(LoaderGenerator, generatorName);

	env.run(generatorName);
}
