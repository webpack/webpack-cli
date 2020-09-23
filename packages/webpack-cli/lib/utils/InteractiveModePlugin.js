const readline = require('readline');
const logger = require('./logger');
const { version } = require('webpack');

const spawnCommand = (msg) => {
    const lines = 3;
    const totalRows = process.stdout.rows;
    readline.cursorTo(process.stdout, 0, totalRows - lines);
    readline.clearScreenDown(process.stdout);

    logger.log(msg);
    process.stdout.write('\nq: quit, s: stop, r: recompile, p: pause');

    readline.cursorTo(process.stdout, 0, totalRows - 2);
    process.stdout.write('➜ ');
};

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

        // Configure keypress event for actions
        const actions = Object.keys(this.keys);
        stdin.on('keypress', (_, actionKey) => {
            const possibleActions = actions.filter((action) => {
                return this.keys[action] === actionKey.name;
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

        // Clear for first run as well
        process.stdout.write('\x1B[2J\x1B[3J\x1B[H');

        // Clear output on watch invalidate
        compiler.hooks.invalid.tap(this.name, () => {
            process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
        });

        if (version.startsWith('5')) {
            compiler.hooks.afterDone.tap(this.name, () => {
                spawnCommand('compilation completed');
            });
        } else {
            compiler.hooks.done.tap(this.name, () => {
                setTimeout(() => {
                    spawnCommand('compilation completed');
                }, 1);
            });
        }
    }

    // eslint-disable-next-line no-unused-vars
    quitHandler(compiler) {
        process.exit(0);
    }

    // eslint-disable-next-line no-unused-vars
    recompileHandler(compiler) {
        // TODO: implement it
        spawnCommand('recompilation not supported');
    }

    // eslint-disable-next-line no-unused-vars
    pauseHandler(compiler) {
        // TODO: implement it
        spawnCommand('pausing not supported');
    }

    // eslint-disable-next-line no-unused-vars
    stopHandler(compiler) {
        //TODO: implement it
        spawnCommand('stop not supported');
    }
}
module.exports = { InteractiveModePlugin };
