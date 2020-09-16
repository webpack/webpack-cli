const readline = require('readline');

class InteractiveModePlugin {
    constructor() {
        this.name = 'InteractiveModePlugin';
        this.keys = {
            quit: 'q',
            recompile: '\n',
            pause: 'p',
        };
        this.handlers = {
            quit: this.quitHandler,
            recompile: this.recompileHandler,
            pause: this.pauseHandler,
        };
    }

    apply(compiler) {
        // Configure stdin for keypress event
        const stdin = process.stdin;
        stdin.setEncoding('utf-8');
        readline.emitKeypressEvents(stdin);

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

        // Clear output afterCompile
        compiler.hooks.afterCompile.tap(this.name, () => {
            process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
        });

        compiler.hooks.done.tap(this.name, () => {
            setTimeout(() => {
                const totalRows = process.stdout.rows;
                readline.cursorTo(process.stdout, 0, totalRows - 1);
                process.stdout.write('> ');
            }, 100);
        });
    }

    // eslint-disable-next-line no-unused-vars
    quitHandler(compiler) {
        process.exit(0);
    }

    // eslint-disable-next-line no-unused-vars
    recompileHandler(compiler) {
        // TODO: implement it
    }

    // eslint-disable-next-line no-unused-vars
    pauseHandler(compiler) {
        // TODO: implement it
    }
}
module.exports = { InteractiveModePlugin };
