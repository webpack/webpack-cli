const { MultiSelect, Input} = require('enquirer');
const runner = require('../runner');
const logger = require('./logger');
const cliArgs = require('./cli-flags').core;

async function prompter() {
    const args = [];

    const typePrompt = new MultiSelect({
        name: 'type',
        message: 'Which flags do you want to use?',
        choices: cliArgs.reduce((prev, curr) => {
            return [...prev, `--${curr.name}`];
        }, [])
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
    await questions.reduce((prev, curr) => {
        return prev.then(() => curr.run().then((flagArgs) => {
            args.push(...flagArgs);
        }));
    }, Promise.resolve(null));

    return [...args, ...boolArgs];
}

async function run() {
    const args = await prompter();
    process.stdout.write('\n');
    logger.info(`Executing CLI\n`);
    runner([], args);
}

run();
