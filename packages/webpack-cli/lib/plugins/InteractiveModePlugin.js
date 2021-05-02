const readline = require('readline');
const { red, green, cyanBright, bold } = require('colorette');
const { SyncHook } = require('tapable');
let version;
try {
    version = require('webpack').version;
} catch (err) {
    process.exit(2);
}

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

    console.log(bold(cyanBright(`ⓘ  ${msg}`)));
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

const isWebpack5 = version.startsWith('5');

/**
 * Interactive Mode plugin
 */
class InteractiveModePlugin {
    constructor() {
        this.name = 'webpack-cli-interactive-mode';
        this.keys = {
            quit: 'q',
            stop: 's',
            start: 'w',
        };
        this.handlers = {
            quit: this.quitHandler.bind(this),
            stop: this.stopHandler.bind(this),
            start: this.startHandler.bind(this),
        };
        this.logger = undefined;
    }

    apply(compiler) {
        // Assign logger
        this.logger = compiler.getInfrastructureLogger(this.name);
        const compilers = compiler.compilers ? compiler.compilers : [compiler];

        if (!isWebpack5) {
            this.logger.error('Interactive is not supported on webpack v4 and less');
            process.exit(1);
        }

        // Configure stdin for keypress event
        const stdin = process.stdin;
        stdin.setEncoding('utf-8');
        stdin.setRawMode(true);
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
            this.handlers[action](compiler, compilers);
        });

        // Register Custom Hook for printing after clrscr
        if (!compiler.hooks.beforeInteractiveOutput) {
            compiler.hooks = {
                ...compiler.hooks,
                beforeInteractiveOutput: new SyncHook(),
            };
        }

        let beforeCompileCount = 0;
        for (const childCompiler of compilers) {
            // eslint-disable-next-line no-loop-func
            childCompiler.hooks.beforeCompile.tap(this.name, () => {
                beforeCompileCount += 1;
                if (beforeCompileCount === 1) {
                    clrscr();
                    compiler.hooks.beforeInteractiveOutput.call();
                }
                if (beforeCompileCount === compilers.length) {
                    beforeCompileCount = 0;
                }
            });
        }

        let afterDoneCount = 0;
        for (const childCompiler of compilers) {
            // eslint-disable-next-line no-loop-func
            childCompiler.hooks.afterDone.tap(this.name, () => {
                afterDoneCount += 1;
                if (afterDoneCount === compilers.length) {
                    afterDoneCount = 0;
                    process.nextTick(() => {
                        process.stdout.write('\n\n\n');
                        spawnCommand('compilations completed', true);
                    });
                }
            });
        }
    }

    quitHandler(compiler, compilers) {
        for (const childCompiler of compilers) {
            if (childCompiler.watching === undefined) continue;
            childCompiler.watching.close();
            childCompiler.close(() => {});
        }
        process.exit(0);
    }

    startHandler(compiler, compilers) {
        const allWatching = compilers.reduce((result, childCompiler) => {
            return result && !childCompiler.watching.suspended;
        }, true);

        if (allWatching) {
            spawnCommand('already watching', true);
            return;
        }

        for (const childCompiler of compilers) {
            if (childCompiler.watching && childCompiler.watching.suspended) {
                childCompiler.watching.resume();
                childCompiler.watching.invalidate();
            }
        }
    }

    stopHandler(compiler, compilers) {
        const allSuspended = compilers.reduce((result, childCompiler) => {
            return result && childCompiler.watching.suspended;
        }, true);

        if (allSuspended) {
            spawnCommand('already stoped', false);
            return;
        }

        for (const childCompiler of compilers) {
            if (!childCompiler.watching.suspended) {
                childCompiler.watching.suspend();
            }
        }
        spawnCommand('stoped watching', false);
        return;
    }
}
module.exports = InteractiveModePlugin;
