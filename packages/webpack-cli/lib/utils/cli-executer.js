const { MultiSelect, Input} = require('enquirer');
const runner = require('../runner');
const logger = require('./logger');
const allArgs = require('./cli-flags');

logger.info(`Initiating webpack-cli executer \n`);

const cliArgs = [];
const nodeArgs = [];
async function prompter() {
    const typePrompt = new MultiSelect({
        name: 'type',
        message: 'Which flags do you want to use ?',
        choices: allArgs.core.reduce((prev, curr) => {
            return [...prev, `--${curr.name}`];
        }, [])
    });

    const selections = await typePrompt.run();
    const questions = selections.map(selection => {
        const options = allArgs.core.find(flag => {
            return flag.name === selection.slice(2);
        });

        if (options.type == Boolean) {
            return {
                run: () => Promise.resolve([selection])
            };
        }

        const valuePrompt = new Input({
            name: 'value',
            message: `Enter value of the ${selection} flag`,
            initial: options.defaultValue,
            result: (value) => [selection, value]
        });
        return valuePrompt;
    });
    await questions.reduce((prev, curr) => {
        return prev.then(() => curr.run().then((args) => {
            cliArgs.push(...args);
        }));
    }, Promise.resolve(null))
}

async function run() {
    await prompter();
    process.stdout.write('\n');
    logger.info(`Executing CLI\n`);
    runner([], cliArgs);
}

run();
