const { MultiSelect, Input } = require('enquirer');
import runner from 'webpack-cli/lib/runner';
import logger from 'webpack-cli/lib/utils/logger';
import {core as cliArgs} from 'webpack-cli/lib/utils/cli-flags';
import chalk from 'chalk'

async function prompter() {
    const args = [];
    const typePrompt = new MultiSelect({
        name: 'type',
        message: 'Which flags do you want to use?',
        choices: cliArgs.reduce((prev, curr) => {
            return [...prev, `--${curr.name}: ${curr.description}`];
        }, []),
        result: (value) => {
            return value.map((flag) => flag.split(":")[0]);
        }
    });
    const selections = await typePrompt.run();
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
            result: (value) => [selection, value]
        });
        questions.push(valuePrompt);
    });

    // Create promise chain to force synchronous prompt of question
    for await (let question of questions) {
        const flagArgs = await question.run();
        args.push(...flagArgs);
    }

    return [...args, ...boolArgs];
}

export default async function run() {
    try {
      const args = await prompter();
      process.stdout.write('\n');
      logger.info(`Executing CLI\n`);
      runner([], args);
    } catch (err) {
      logger.error(`Action Interrupted, use ${chalk.cyan(`webpack-cli help`)} to see possible options.`)
    }
}
