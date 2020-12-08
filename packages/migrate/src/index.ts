import { green, red } from 'colorette';
import { Change, diffLines } from 'diff';
import fs from 'fs';
import inquirer from 'inquirer';
import Listr from 'listr';
import pLazy = require('p-lazy');
import path from 'path';
import { validate, WebpackOptionsValidationError } from 'webpack';
import { runPrettier } from '@webpack-cli/utils';
import { transformations } from './migrate';
import { Node } from './types/NodePath';
import jscodeshift from 'jscodeshift';

declare let process: {
    cwd: Function;
    webpackModule: {
        validate: Function;
        WebpackOptionsValidationError: {
            new: (
                errors: string[],
            ) => {
                message: string;
            };
        };
    };
    stdout: {
        write: Function;
    };
    exitCode: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function runMigration(currentConfigPath: string, outputConfigPath: string, logger: any): Promise<void> | void {
    const recastOptions: object = {
        quote: 'single',
    };

    const tasks: Listr = new Listr([
        {
            task: (ctx: Node): string | void | Listr | Promise<{}> =>
                new pLazy((resolve: (value?: object) => void, reject: (reason?: string | object, err?: object) => void): void => {
                    fs.readFile(currentConfigPath, 'utf8', (err: object, content: string): void => {
                        if (err) {
                            reject(err);
                        }
                        try {
                            ctx.source = content;
                            ctx.ast = jscodeshift(content);
                            resolve();
                        } catch (err) {
                            reject('Error generating AST', err);
                        }
                    });
                }),
            title: 'Reading webpack config',
        },
        {
            task: (ctx: Node): string | void | Listr | Promise<{}> => {
                return new Listr(
                    Object.keys(transformations).map((key: string): {
                        task: () => string;
                        title: string;
                    } => {
                        const transform: Function = transformations[key];
                        return {
                            task: (): string => transform(ctx.ast, ctx.source),
                            title: key,
                        };
                    }),
                );
            },
            title: 'Migrating config to newest version',
        },
    ]);

    return tasks
        .run()
        .then((ctx: Node): void | Promise<void> => {
            const result: string = ctx.ast.toSource(recastOptions);
            const diffOutput: Change[] = diffLines(ctx.source, result);

            diffOutput.forEach((diffLine: Change): void => {
                if (diffLine.added) {
                    process.stdout.write(green(`+ ${diffLine.value}`));
                } else if (diffLine.removed) {
                    process.stdout.write(red(`- ${diffLine.value}`));
                }
            });

            return inquirer
                .prompt([
                    {
                        default: 'Y',
                        message: 'Are you sure these changes are fine?',
                        name: 'confirmMigration',
                        type: 'confirm',
                    },
                ])
                .then(
                    (answers: { confirmMigration: boolean }): Promise<{}> => {
                        if (answers.confirmMigration) {
                            return inquirer.prompt([
                                {
                                    default: 'Y',
                                    message:
                                        'Do you want to validate your configuration? ' +
                                        "(If you're using webpack merge, validation isn't useful)",
                                    name: 'confirmValidation',
                                    type: 'confirm',
                                },
                            ]);
                        } else {
                            logger.error('✖ Migration aborted');
                        }
                    },
                )
                .then(
                    async (answer: { confirmValidation: boolean }): Promise<void> => {
                        if (!answer) {
                            return;
                        }

                        runPrettier(outputConfigPath, result);

                        if (answer.confirmValidation) {
                            const outputConfig = (await import(outputConfigPath)).default;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const webpackOptionsValidationErrors: any = validate(outputConfig);
                            if (webpackOptionsValidationErrors && webpackOptionsValidationErrors.length) {
                                logger.error("\n✖ Your configuration validation wasn't successful\n");
                                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                // @ts-ignore
                                logger.error(new WebpackOptionsValidationError(webpackOptionsValidationErrors));
                            }
                        }

                        logger.success(`\n✔︎ New webpack config file is at ${outputConfigPath}.`);
                        logger.success('✔︎ Heads up! Updating to the latest version could contain breaking changes.');

                        logger.success('✔︎ Plugin and loader dependencies may need to be updated.');
                    },
                );
        })
        .catch((err: object): void => {
            logger.error('\n ✖ ︎Migration aborted due to some errors:\n');
            logger.error(err);
            process.exitCode = 1;
        });
}

class MigrationCommand {
    apply(cli): void {
        const { program, logger } = cli;

        program
            .command('migrate <config-path> [new-config-path]')
            .alias('m')
            .description('Migrate a configuration to a new version')
            .usage('migrate <config-path> [new-config-path]')
            .action(async (configPath: string, newConfigPath: string | undefined) => {
                const currentConfigPath = path.resolve(configPath);
                let outputConfigPath: string;

                if (!newConfigPath) {
                    try {
                        const { confirmPath } = await inquirer.prompt([
                            {
                                default: 'Y',
                                message: 'Migration output path not specified. Do you want to use your existing webpack configuration?',
                                name: 'confirmPath',
                                type: 'confirm',
                            },
                        ]);
                        if (!confirmPath) {
                            logger.error('︎Migration aborted due to no output path');
                            return;
                        }
                        outputConfigPath = path.resolve(configPath);

                        await runMigration(currentConfigPath, outputConfigPath, logger);
                    } catch (err) {
                        logger.error(err);
                        return;
                    }

                    return;
                }

                outputConfigPath = path.resolve(newConfigPath);

                await runMigration(currentConfigPath, outputConfigPath, logger);
            });
    }
}

export default MigrationCommand;
