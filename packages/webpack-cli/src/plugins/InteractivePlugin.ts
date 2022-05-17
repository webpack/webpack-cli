import { type Compiler } from "webpack";
// eslint-disable-next-line node/no-extraneous-import
import { SyncHook } from "tapable";

type TKeys = {
  quit: string;
  stop: string;
  start: string;
};

type THandler = (compilers: Compiler[]) => Promise<void>;

type THandlers = {
  quit: THandler;
  stop: THandler;
  start: THandler;
};

const compilerHooksMap = new WeakMap<Compiler, Record<string, SyncHook<unknown>>>();

class InteractivePlugin {
  public name = "webpack-interactive-cli";
  private keys: TKeys;
  private verbose: boolean;
  private handlers: THandlers;

  static getCompilerHooks(compiler: Compiler) {
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

  apply(compiler: Compiler) {
    return;
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
