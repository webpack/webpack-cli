import WebpackCLI from './webpack-cli';
import utils from './utils';

const runCLI = async (args: Record<string, any>, originalModuleCompile: any): Promise<void> => {
    try {
        // Create a new instance of the CLI object
        const cli = new WebpackCLI();

        cli._originalModuleCompile = originalModuleCompile;

        await cli.run(args);
    } catch (error) {
        utils.logger.error(error);
        process.exit(2);
    }
};

export default runCLI;
