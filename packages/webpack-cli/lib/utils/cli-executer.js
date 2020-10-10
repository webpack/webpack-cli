const { MultiSelect, Input } = require('enquirer');
const { cyan } = require('colorette');
const logger = require('./logger');
const cliArgs = require('./cli-flags').core;

const prompter = async () => {
    const args = [];

    const typePrompt = new MultiSelect({
        name: 'type',
        message: 'Which flags do you want to use?',
        choices: cliArgs.reduce((prev, curr) => {
            return [...prev, `--${curr.name}: ${curr.description}`];
        }, []),
        result: (value) => {
            return value.map((flag) => flag.split(':')[0]);
        },
    });

    const selections = await typePrompt.run();

    const boolArgs = [];
    const questions = [];
    selections.forEach((selection) => {
        const options = cliArgs.find((flag) => {
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
            result: (value) => [selection, value],
            validate: (value) => Boolean(value),
        });
        questions.push(valuePrompt);
    });

    // Create promise chain to force synchronous prompt of question
    for await (const question of questions) {
        const flagArgs = await question.run();
        args.push(...flagArgs);
    }

    return [...args, ...boolArgs];
};

const run = async () => {
    try {
        const args = await prompter();
        logger.info('\nExecuting CLI\n');
        return args;
    } catch (err) {
        logger.error(`Action Interrupted, use ${cyan('webpack-cli help')} to see possible options.`);
        process.exit(2);
    }
};

module.exports = run;
