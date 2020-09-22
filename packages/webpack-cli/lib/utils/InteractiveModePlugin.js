const readline = require('readline');
const logger = require('./logger');

class InteractiveModePlugin {
    constructor() {
        this.name = 'InteractiveModePlugin';
        this.keys = {
            quit: 'q',
            recompile: 'r',
            pause: 'p',
            stop: 's',
        };
        this.handlers = {
            quit: this.quitHandler,
            recompile: this.recompileHandler,
            pause: this.pauseHandler,
            stop: this.stopHandler,
        };
    }

    apply(compiler) {
        // Configure stdin for keypress event
        const stdin = process.stdin;
        stdin.setEncoding('utf-8');
        readline.emitKeypressEvents(stdin);
        if (process.stdout.isTTY) {
            stdin.setRawMode(true);
        }

        // Configure keypress event for actions
        const actions = Object.keys(this.keys);
        stdin.on('keypress', (_, actionKey) => {
            const possibleActions = actions.filter((key) => {
                return this.keys[key] === actionKey.name;
            });

            if (possibleActions.length === 0) {
                return;
            }

            if (possibleActions.length > 1) {
                throw new Error('Multiple actions are provided for same key');
            }

            const action = possibleActions[0];
            this.handlers[action](compiler);
        });

        // Clear output on watch invalidate
        compiler.hooks.invalid.tap(this.name, () => {
            process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
        });

        compiler.hooks.afterDone.tap(this.name, () => {
            const totalRows = process.stdout.rows;
            readline.cursorTo(process.stdout, 0, totalRows - 1);
            process.stdout.write('> ');
        });
    }

    // eslint-disable-next-line no-unused-vars
    quitHandler(compiler) {
        process.exit(0);
    }

    // eslint-disable-next-line no-unused-vars
    recompileHandler(compiler) {
        // TODO: implement it
        const totalRows = process.stdout.rows;
        readline.cursorTo(process.stdout, 0, totalRows - 2);
        logger.info('recompling is not supported');
        process.stdout.write('> ');
    }

    // eslint-disable-next-line no-unused-vars
    pauseHandler(compiler) {
        // TODO: implement it
        const totalRows = process.stdout.rows;
        readline.cursorTo(process.stdout, 0, totalRows - 2);
        logger.info('pausing is not supported       ');
        process.stdout.write('> ');
    }

    // eslint-disable-next-line no-unused-vars
    stopHandler(compiler) {
        //TODO: implement it
        const totalRows = process.stdout.rows;
        readline.cursorTo(process.stdout, 0, totalRows - 2);
        logger.info('stoping is not supported');
        process.stdout.write('> ');
    }
}
module.exports = { InteractiveModePlugin };
