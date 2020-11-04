const readline = require('readline');
const logger = require('./logger');
const { version } = require('webpack');
const { red, green } = require('colorette');

/**
 * Displays command space at bottom of screen
 * @param {string} msg message to print with command
 * @param {boolean} status currently watching or not
 */
const spawnCommand = (msg, status) => {
    const lines = 3;
    const totalRows = process.stdout.rows;
    readline.cursorTo(process.stdout, 0, totalRows - lines);
    readline.clearScreenDown(process.stdout);

    logger.log(msg);
    process.stdout.write('\n');

    readline.cursorTo(process.stdout, 0, totalRows - 2);

    // for current status
    if (status) {
        process.stdout.write(`${green('⬤')}  `);
    } else {
        process.stdout.write(`${red('⬤')}  `);
    }
};

/**
 * Clear the whole terminal
 */
const clrscr = () => {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
};

class InteractiveModePlugin {
    constructor() {
        this.isMultiCompiler = false;
        this.compilers = undefined;
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

        if (compiler.compilers) {
            this.isMultiCompiler = true;
            this.compilers = compiler.compilers;
        }

        // // Clear for first run as well
        // clrscr();

        if (!this.isMultiCompiler) {
            // Clear output on watch invalidate
            compiler.hooks.beforeCompile.tap(this.name, () => {
                clrscr();
            });

            if (version.startsWith('5')) {
                compiler.hooks.afterDone.tap(this.name, () => {
                    setTimeout(() => {
                        spawnCommand('compilation completed', true);
                    }, 1);
                });
            } else {
                compiler.hooks.done.tap(this.name, () => {
                    setTimeout(() => {
                        spawnCommand('compilation completed', true);
                    }, 1);
                });
            }
        } else {
            // Clear when any one of child watch invalidates
            for (const childCompiler of this.compilers) {
                childCompiler.hooks.beforeCompile.tap(this.name, () => {
                    clrscr();
                    console.log('Apple');
                });
            }
        }
    }

    quitHandler(compiler) {
        if (version.startsWith(5) && compiler.watching !== undefined) {
            compiler.watching.close(() => {
                process.exit();
            });
            return;
        }
        process.exit(0);
    }

    startHandler(compiler) {
        if (!version.startsWith('5')) {
            spawnCommand('starting not supported', true);
            return;
        }

        if (!compiler.watching.suspended) {
            spawnCommand('already watching', true);
            return;
        }

        clrscr();
        compiler.watching.resume();
    }

    stopHandler(compiler) {
        if (!version.startsWith('5')) {
            spawnCommand('stoping not supported', true);
            return;
        }

        if (compiler.watching.suspended) {
            spawnCommand('already stoped', false);
            return;
        }

        compiler.watching.suspend();
        spawnCommand('stoped watching', false);
    }
}
module.exports = { InteractiveModePlugin };
