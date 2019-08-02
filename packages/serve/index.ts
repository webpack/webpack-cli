import * as cmdArgs from "command-line-args";
import * as WebpackCLI from "../../lib/webpack-cli";
import * as startDevServer from "./startDevServer";
import * as argsToCamelCase from "./argsToCamelCase";
import { devServer } from "./flags";
import { core } from "../../lib/utils/cli-flags";

/**
 *
 * Creates a webpack compiler and runs the devServer
 *
 * @param {String[]} args - args processed from the CLI
 * @returns {Function} invokes the devServer API
 */
export default function serve(args): Promise<void | Function> {
	const cli = new WebpackCLI();
	// partial parsing usage: https://github.com/75lb/command-line-args/wiki/Partial-parsing

	// since the webpack flags have the 'entry' option set as it's default option,
	// we need to parse the dev server args first. Otherwise, the webpack parsing could snatch
	// one of the dev server's options and set it to this 'entry' option.
	// see: https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md#optiondefaultoption--boolean
	const devServerArgs = cmdArgs(devServer, { argv: args, partial: true });
	const webpackArgs = cmdArgs(core, { argv: devServerArgs._unknown || [], stopAtFirstUnknown: false });
	const finalArgs = argsToCamelCase.default(devServerArgs._all || {});
	// pass along the 'hot' argument to the dev server if it exists
	if (webpackArgs && webpackArgs._all && typeof webpackArgs._all.hot !== 'undefined') {
		finalArgs['hot'] = webpackArgs._all.hot;
	}
    return new Promise((resolve): void => {
		cli.getCompiler(webpackArgs, core).then((compiler): void => {
			startDevServer.default(compiler, finalArgs, resolve);
		});
	});
}
