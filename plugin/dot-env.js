import dotenv from "dotenv-defaults";

const interpolate = (env, vars) => {
  const matches = env.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];
  matches.forEach((match) => {
    env = env.replace(match, interpolate(vars[match.replace(/\$|{|}/g, "")] || "", vars));
  });
  return env;
};

const isMainThreadElectron = (target) => target.startsWith("electron") && target.endsWith("main");

class Dotenv {
  constructor(config = {}) {
    this.config = Object.assign(
      {},
      {
        path: "./.env",
        prefix: "process.env.",
      },
      config,
    );
    this.cache = {};
  }

  apply(compiler) {
    const variables = this.gatherVariables(compiler.inputFileSystem);
    const target = compiler.options.target ?? "web";
    const version = (compiler.webpack && compiler.webpack.version) || "4";
    const data = this.formatData({
      variables,
      target,
      version,
    });
    const DefinePlugin =
      (compiler.webpack && compiler.webpack.DefinePlugin) || require("webpack").DefinePlugin;
    new DefinePlugin(data).apply(compiler);
  }

  gatherVariables(inputFileSystem) {
    const { safe, allowEmptyValues } = this.config;
    const vars = this.initializeVars();

    const { env, blueprint } = this.getEnvs(inputFileSystem);

    Object.keys(blueprint).forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : env[key];

      const isMissing =
        typeof value === "undefined" || value === null || (!allowEmptyValues && value === "");

      if (safe && isMissing) {
        throw new Error(`Missing environment variable: ${key}`);
      } else {
        vars[key] = value;
      }
    });

    // add the leftovers
    if (safe) {
      Object.keys(env).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(vars, key)) {
          vars[key] = env[key];
        }
      });
    }

    return vars;
  }

  initializeVars() {
    return this.config.systemvars ? Object.assign({}, process.env) : {};
  }

  getEnvs(inputFileSystem) {
    const { path, silent, safe } = this.config;

    const env = dotenv.parse(
      this.loadFile(path, silent, inputFileSystem),
      this.getDefaults(inputFileSystem),
    );

    let blueprint = env;
    if (safe) {
      let file = `${path}.example`;
      if (safe !== true) {
        file = safe;
      }
      blueprint = dotenv.parse(
        this.loadFile({
          file,
          silent,
        }),
      );
    }

    return {
      env,
      blueprint,
    };
  }

  getDefaults(inputFileSystem) {
    const { path, silent, defaults } = this.config;
    const defaultFile = defaults === true ? `${path}.defaults` : defaults;
    return this.loadFile(defaultFile, silent, inputFileSystem);
  }

  formatData({ variables = {}, target, version }) {
    const { expand, prefix } = this.config;
    const formatted = Object.keys(variables).reduce((obj, key) => {
      const v = variables[key];
      const vKey = `${prefix}${key}`;
      let vValue;
      if (expand) {
        if (v.substring(0, 2) === "\\$") {
          vValue = v.substring(1);
        } else if (v.indexOf("\\$") > 0) {
          vValue = v.replace(/\\\$/g, "$");
        } else {
          vValue = interpolate(v, variables);
        }
      } else {
        vValue = v;
      }

      obj[vKey] = JSON.stringify(vValue);

      return obj;
    }, {});

    // We have to stub any remaining `process.env`s due to Webpack 5 not polyfilling it anymore
    // https://github.com/mrsteele/dotenv-webpack/issues/240#issuecomment-710231534
    // However, if someone targets Node or Electron `process.env` still exists, and should therefore be kept
    // https://webpack.js.org/configuration/target
    if (this.shouldStub({ target, version })) {
      // Results in `"MISSING_ENV_VAR".NAME` which is valid JS
      formatted["process.env"] = '"MISSING_ENV_VAR"';
    }

    return formatted;
  }

  shouldStub({ target: targetInput, version }) {
    if (!version.startsWith("5")) {
      return false;
    }

    const targets = Array.isArray(targetInput) ? targetInput : [targetInput];

    return targets.every(
      (target) =>
        // If configured prefix is 'process.env'
        this.config.prefix === "process.env." &&
        // If we're not configured to never stub
        this.config.ignoreStub !== true &&
        // And
        // We are configured to always stub
        (this.config.ignoreStub === false ||
          // Or if we should according to the target
          (!target.includes("node") && !isMainThreadElectron(target))),
    );
  }

  /**
   * Load a file.
   * @param {String} config.file - The file to load.
   * @param {Boolean} config.silent - If true, suppress warnings, if false, display warnings.
   * @returns {Object}
   */
  loadFile(filePath, silent, inputFileSystem) {
    if (this.cache[filePath]) {
      return this.cache[filePath];
    }
    try {
      const content = inputFileSystem.readFileSync(filePath, "utf8");
      this.cache[filePath] = content;
      return content;
    } catch (err) {
      if (!silent) console.warn(`Failed to load ${filePath}.`);
      return {};
    }
  }

  /**
   * Displays a console message if 'silent' is falsey
   * @param {String} msg - The message.
   * @param {Boolean} silent - If true, display the message, if false, suppress the message.
   */
  warn(msg, silent) {
    !silent && console.warn(msg);
  }
}

export default Dotenv;
