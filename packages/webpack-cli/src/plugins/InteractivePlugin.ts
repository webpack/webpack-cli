/* eslint-disable no-loop-func */
import { MultiCompiler, type Compiler } from "webpack";
// eslint-disable-next-line node/no-extraneous-import
import { SyncHook } from "tapable";
import { emitKeypressEvents } from "readline";

type TKeys = {
  quit: string;
  stop: string;
  start: string;
};

type THandler = (compilers: Compiler[], compiler?: Compiler | MultiCompiler) => Promise<void>;

type THandlers = {
  quit: THandler;
  stop: THandler;
  start: THandler;
};

const compilerHooksMap = new WeakMap<Compiler | MultiCompiler, Record<string, SyncHook<unknown>>>();

class InteractivePlugin {
  public name = "webpack-interactive-cli";
  private keys: TKeys;
  private verbose: boolean;
  private handlers: THandlers;

  static getCompilerHooks(compiler: Compiler | MultiCompiler) {
    let hooks = compilerHooksMap.get(compiler);
    if (hooks === undefined) {
      hooks = {
        beforeInteractiveOutput: new SyncHook(),
      };
      compilerHooksMap.set(compiler, hooks);
    }
    return hooks;
  }

  constructor(options = { mode: "verbose" }) {
    this.keys = {
      quit: "q",
      stop: "s",
      start: "w",
    };

    this.verbose = options.mode === "verbose";

    this.handlers = {
      quit: this.quit.bind(this),
      stop: this.stop.bind(this),
      start: this.start.bind(this),
    };
  }

  apply(compiler: Compiler | MultiCompiler) {
    this.hideCursor();

    // Check for webpack version
    if ("compilers" in compiler ? !compiler.compilers[0].webpack : !compiler.webpack) {
      process.stderr.write("Interactive is not supported on webpack v4 and less.");
      process.exit(1);
    }

    const hooks = InteractivePlugin.getCompilerHooks(compiler);
    const compilers = "compilers" in compiler ? compiler.compilers : [compiler];
    const events = Object.keys(this.keys) as (keyof TKeys)[];

    const { stdin } = process;
    stdin.setEncoding("utf-8");
    stdin.setRawMode(true);
    emitKeypressEvents(stdin);
    stdin.on("keypress", (_, actionKey) => {
      if (actionKey && actionKey.ctrl && ["c", "d"].includes(actionKey.name)) {
        this.handlers["quit"](compilers, compiler);
        return;
      }

      const event = events.filter((evt) => this.keys[evt] === actionKey.name)[0];

      if (!event) {
        return;
      }

      this.handlers[event](compilers, compiler);
    });

    let beforeCompileCount = 0,
      afterDoneCount = 0;

    for (const child of compilers) {
      child.hooks.beforeCompile.tap(this.name, () => {
        if (beforeCompileCount === 0) {
          this.clearScreen();
          hooks.beforeInteractiveOutput.call(null);
        }
        beforeCompileCount = (beforeCompileCount + 1) % compilers.length;
      });

      child.hooks.afterDone.tap(this.name, () => {
        if (afterDoneCount === compilers.length) {
          process.nextTick(() => {
            // Reprint Interactive Interface
          });
        }
        afterDoneCount = (afterDoneCount + 1) % compilers.length;
      });
    }
  }

  hideCursor() {
    process.stdout.write("\u001B[?25l");

    process.on("beforeExit", () => {
      process.stdout.write("\u001B[?25h");
    });

    process.on("exit", () => {
      process.stdout.write("\u001B[?25h");
    });
  }

  clearScreen() {
    process.stdout.write("\x1B[2J\x1B[3J\x1B[H");
  }

  async quit(compilers: Compiler[]) {
    return;
  }

  async stop(compilers: Compiler[]) {
    return;
  }

  async start(compilers: Compiler[]) {
    return;
  }
}

export default InteractivePlugin;
