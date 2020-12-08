import { initGenerator } from '@webpack-cli/generators';
import { modifyHelperUtil, npmPackagesExists } from '@webpack-cli/utils';

class InitCommand {
    apply(cli): void {
        const { program } = cli;

        program
            .command('init [scaffold...]')
            .alias('c')
            .description('Initialize a new webpack configuration')
            .usage('init [scaffold] [options]')
            .option('--auto')
            .option('--force')
            .option('--generation-path <value>')
            .action((scaffold, program) => {
                const options = program.opts();

                if (Object.keys(options).length > 0) {
                    modifyHelperUtil('init', initGenerator, null, null, options.auto, options.force, options.generationPath);

                    return;
                }

                npmPackagesExists(scaffold);
            });
    }
}

export default InitCommand;
