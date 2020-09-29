const readline = require('readline');
const logger = require('./logger');
const { version } = require('webpack');
const { red, green } = require('colorette');

const spawnCommand = (msg, status) => {
    const lines = 3;
    const totalRows = process.stdout.rows;
    readline.cursorTo(process.stdout, 0, totalRows - lines);
    readline.clearScreenDown(process.stdout);

    logger.log(msg);
    process.stdout.write('\n');

    readline.cursorTo(process.stdout, 0, totalRows - 2);
    if (status) {
        process.stdout.write(`${green('➜')} `);
    } else {
        process.stdout.write(`${red('➜')} `);
    }
};

const clrscr = () => {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
};

class InteractiveModePlugin {
    constructor() {
        this.name = 'InteractiveModePlugin';
        this.keys = {
            quit: 'q',
            stop: 's',
            start: 'w',
        };
        this.handlers = {
            quit: this.quitHandler,
            stop: this.stopHandler,
            start: this.startHandler,
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
        clrscr();

        // Clear output on watch invalidate
        compiler.hooks.invalid.tap(this.name, () => {
            clrscr();
        });

        if (version.startsWith('5')) {
            compiler.hooks.afterDone.tap(this.name, () => {
                setTimeout(() => {
                    spawnCommand('compilation completed', compiler.watching);
                }, 1);
            });
        } else {
            compiler.hooks.done.tap(this.name, () => {
                setTimeout(() => {
                    spawnCommand('compilation completed', compiler.watching);
                }, 1);
            });
        }
    }

    // eslint-disable-next-line no-unused-vars
    quitHandler(compiler) {
        process.exit(0);
    }

    startHandler(compiler) {
        if (!version.startsWith('5')) {
            spawnCommand('starting not supported', compiler.watching);
            return;
        }

        if (compiler.watching) {
            spawnCommand('already running', compiler.watching);
            return;
        }

        clrscr();
        compiler.watch({}, () => {});
    }

    stopHandler(compiler) {
        if (!version.startsWith('5')) {
            spawnCommand('stoping not supported', compiler.watching);
            return;
        }

        if (!compiler.watching) {
            spawnCommand('already stoped', compiler.watching);
            return;
        }

        compiler.watching.close(() => {
            spawnCommand('stoped watching', compiler.watching);
        });
    }
}
module.exports = { InteractiveModePlugin };
