import runner from 'webpack-cli/lib/runner';
import logger from 'webpack-cli/lib/utils/logger';
import { core as cliArgs } from 'webpack-cli/lib/utils/cli-flags';
import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MultiSelect, Input } = require('enquirer');

async function prompter(): Promise<string[]> {
    const args = [];
    const typePrompt = new MultiSelect({
        name: 'type',
        message: 'Which flags do you want to use?',
        choices: cliArgs.reduce((prev, curr) => {
            return [...prev, `--${curr.name}: ${curr.description}`];
        }, []),
        result: (value: string[] ): string[] => {
            return value.map(flag => flag.split(':')[0]);
        },
    });
    const selections: string[] = await typePrompt.run();
    const boolArgs = [];
    const questions = [];

    selections.forEach(selection => {
        const options = cliArgs.find(flag => {
            return flag.name === selection.slice(2);
        });

        if (options.type === Boolean) {
            boolArgs.push(selection);
            return;
        }

        const valuePrompt = new Input({
            name: 'value',
            message: `Enter value of the ${selection} flag`,
            initial: options.defaultValue,
            result: (value: string): string[] => [selection, value],
        });
        questions.push(valuePrompt);
    });

    // Create promise chain to force synchronous prompt of question
    for await (const question of questions) {
        const flagArgs = await question.run();
        args.push(...flagArgs);
    }

    return [...args, ...boolArgs];
}

export default async function run(): Promise<void> {
    try {
        const args = await prompter();
        process.stdout.write('\n');
        logger.info('Executing CLI\n');
        runner([], args);
    } catch (err) {
        logger.error(`Action Interrupted, use ${chalk.cyan('webpack-cli help')} to see possible options.`);
    }
}
