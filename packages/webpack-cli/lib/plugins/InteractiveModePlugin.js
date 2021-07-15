const readline = require("readline");
const { red, green, cyanBright, bold, gray } = require("colorette");
const { SyncHook } = require("tapable");
const logger = require("../utils/logger");

/**
 * Interactive Mode plugin
 */
class InteractiveModePlugin {
    constructor(mode = "verbose") {
        this.name = "webpack-cli-interactive-mode";
        this.keys = {
            quit: "q",
            stop: "s",
            start: "w",
        };
        this.handlers = {
            quit: this.quitHandler.bind(this),
            stop: this.stopHandler.bind(this),
            start: this.startHandler.bind(this),
        };
        this.logger = undefined;
        this.verbose = mode === "verbose";

        // hide cursor
        process.stdout.write("\u001B[?25l");
    }

    apply(compiler) {
        if (compiler.compilers ? !compiler.compilers[0].webpack : !compiler.webpack) {
            // Use CLI logger as webpack v4 may not expose logger
            logger.error("Interactive is not supported on webpack v4 and less");
            // Show cursor
            process.stdout.write("\u001B[?25h");
            process.exit(1);
        }

        const compilers = compiler.compilers ? compiler.compilers : [compiler];

        // Assign logger
        this.logger = compilers[0].getInfrastructureLogger(this.name);

        // Configure stdin for keypress event
        const stdin = process.stdin;
        stdin.setEncoding("utf-8");
        if (stdin.setRawMode) {
            stdin.setRawMode(true);
        }
        readline.emitKeypressEvents(stdin);

        // Configure keypress event for actions
        const actions = Object.keys(this.keys);
        stdin.on("keypress", (_, actionKey) => {
            // Implement signal keypresses
            if (actionKey && actionKey.ctrl && (actionKey.name === "c" || actionKey.name === "d")) {
                this.handlers["quit"](compilers, compiler);
            }

            const possibleActions = actions.filter((action) => {
                return this.keys[action] === actionKey.name;
            });

            if (possibleActions.length === 0) {
                return;
            }

            if (possibleActions.length > 1) {
                throw new Error("Multiple actions are provided for same key");
            }

            const action = possibleActions[0];
            this.handlers[action](compilers, compiler);
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
                if (beforeCompileCount === 0) {
                    this.clrscr();
                    compiler.hooks.beforeInteractiveOutput.call();
                }

                beforeCompileCount += 1;
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
                        process.stdout.write(`${this.verbose ? "\n" : ""}\n\n`);
                        this.spawnCommand("compilations completed", true, false);
                    });
                }
            });
        }
    }

    /**
     * Displays command space at bottom of screen
     * @param {string} msg message to print with command
     * @param {boolean} status currently watching or not
     */
    spawnCommand(msg, status, toClear = false) {
        const lines = this.verbose ? 3 : 2;
        const totalRows = process.stdout.rows;
        readline.cursorTo(process.stdout, 0, totalRows - lines);
        readline.clearScreenDown(process.stdout);

        if (toClear) return;

        if (this.verbose) {
            process.stdout.write(`${bold(cyanBright(`i  ${msg}`))}\n`);
            process.stdout.write(`${gray("   q: quit  w: watch  s: pause")}`);
        } else {
            process.stdout.write("\n");
        }

        readline.cursorTo(process.stdout, 0, totalRows - 2);

        // for current status
        if (status) {
            process.stdout.write(`${green("▲")}  `);
        } else {
            process.stdout.write(`${red("▲")}  `);
        }

        readline.cursorTo(process.stdout, 0, totalRows - lines - 1);
    }

    /**
     * Clear the whole terminal
     */
    clrscr() {
        process.stdout.write("\x1B[2J\x1B[3J\x1B[H");
    }

    quitHandler(_compilers, compiler) {
        compiler.close(() => {
            this.spawnCommand("", true, true);
            // Show cursor
            process.stdout.write("\u001B[?25h");
            process.exit(0);
        });
    }

    startHandler(compilers) {
        const allWatching = compilers.reduce((result, childCompiler) => {
            return result && !childCompiler.watching.suspended;
        }, true);

        if (allWatching) {
            this.spawnCommand("already watching", true, false);
            return;
        }

        for (const childCompiler of compilers) {
            if (childCompiler.watching && childCompiler.watching.suspended) {
                childCompiler.watching.resume();
                childCompiler.compile(() => {});
            }
        }
        this.spawnCommand("started watching", true, true);
    }

    stopHandler(compilers) {
        const allSuspended = compilers.reduce((result, childCompiler) => {
            return result && childCompiler.watching.suspended;
        }, true);

        if (allSuspended) {
            this.spawnCommand("already stoped", false, false);
            return;
        }

        for (const childCompiler of compilers) {
            if (!childCompiler.watching.suspended) {
                childCompiler.watching.suspend();
            }
        }
        this.spawnCommand("stoped watching", false, false);
        return;
    }
}
module.exports = InteractiveModePlugin;
