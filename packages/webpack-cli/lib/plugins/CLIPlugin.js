/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").WebpackPluginInstance} WebpackPluginInstance */

/**
 * @typedef {Object} Options
 * @property {string} [configPath]
 * @property {"profile"} [progress]
 * @property {boolean} [hot]
 * @property {boolean} [prefetch]
 * @property {boolean} [analyze]
 */

class CLIPlugin {
  /**
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {Compiler} compiler
   */
  setupHotPlugin(compiler) {
    const { HotModuleReplacementPlugin } = compiler.webpack || require("webpack");
    const hotModuleReplacementPlugin = Boolean(
      compiler.options.plugins.find(
        /**
         * @param {WebpackPluginInstance} plugin
         * @returns {boolean}
         */
        (plugin) => plugin instanceof HotModuleReplacementPlugin,
      ),
    );

    if (!hotModuleReplacementPlugin) {
      new HotModuleReplacementPlugin().apply(compiler);
    }
  }

  /**
   * @param {Compiler} compiler
   */
  setupPrefetchPlugin(compiler) {
    const { PrefetchPlugin } = compiler.webpack || require("webpack");

    new PrefetchPlugin(null, this.options.prefetch).apply(compiler);
  }

  /**
   * @param {Compiler} compiler
   * @returns {Promise<void>}
   */
  async setupBundleAnalyzerPlugin(compiler) {
    // eslint-disable-next-line node/no-extraneous-require
    const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
    const bundleAnalyzerPlugin = Boolean(
      compiler.options.plugins.find(
        /**
         * @param {WebpackPluginInstance} plugin
         * @returns {boolean}
         */
        (plugin) => plugin instanceof BundleAnalyzerPlugin,
      ),
    );

    if (!bundleAnalyzerPlugin) {
      new BundleAnalyzerPlugin().apply(compiler);
    }
  }

  /**
   * @param {Compiler} compiler
   */
  setupProgressPlugin(compiler) {
    const { ProgressPlugin } = compiler.webpack || require("webpack");
    const progressPlugin = Boolean(
      compiler.options.plugins.find(
        /**
         * @param {WebpackPluginInstance} plugin
         * @returns {boolean}
         */
        (plugin) => plugin instanceof ProgressPlugin,
      ),
    );

    if (!progressPlugin) {
      new ProgressPlugin({
        profile: this.options.progress === "profile",
      }).apply(compiler);
    }
  }

  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  setupHelpfulOutput(compiler) {
    const pluginName = "webpack-cli";
    const getCompilationName = () => (compiler.name ? `'${compiler.name}'` : "");
    /**
     * @param {string} message
     * @returns {void}
     */
    const logCompilation = (message) => {
      if (process.env.WEBPACK_CLI_START_FINISH_FORCE_LOG) {
        process.stderr.write(message);
      } else {
        /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
        (this.logger).log(message);
      }
    };

    const { configPath } = this.options;

    compiler.hooks.run.tap(pluginName, () => {
      const name = getCompilationName();

      logCompilation(`Compiler${name ? ` ${name}` : ""} starting... `);

      if (configPath) {
        /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
        (this.logger).log(`Compiler${name ? ` ${name}` : ""} is using config: '${configPath}'`);
      }
    });

    compiler.hooks.watchRun.tap(
      pluginName,
      /**
       * @param {Compiler} compiler
       */
      (compiler) => {
        const { bail, watch } = compiler.options;

        if (bail && watch) {
          /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
          (this.logger).warn(
            'You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.',
          );
        }

        const name = getCompilationName();

        logCompilation(`Compiler${name ? ` ${name}` : ""} starting... `);

        if (configPath) {
          /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
          (this.logger).log(`Compiler${name ? ` ${name}` : ""} is using config: '${configPath}'`);
        }
      },
    );

    compiler.hooks.invalid.tap(
      pluginName,
      /**
       * @param {string | null} filename
       * @param {number} changeTime
       */
      (filename, changeTime) => {
        const date = new Date(changeTime * 1000);

        /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
        (this.logger).log(`File '${filename}' was modified`);
        /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
        (this.logger).log(`Changed time is ${date} (timestamp is ${changeTime})`);
      },
    );

    // TODO remove after drop webpack v4
    // @ts-ignore
    (compiler.webpack ? compiler.hooks.afterDone : compiler.hooks.done).tap(pluginName, () => {
      const name = getCompilationName();

      logCompilation(`Compiler${name ? ` ${name}` : ""} finished`);

      process.nextTick(() => {
        if (compiler.watchMode) {
          /** @type {ReturnType<Compiler["getInfrastructureLogger"]>} */
          (this.logger).log(`Compiler${name ? `${name}` : ""} is watching files for updates...`);
        }
      });
    });
  }

  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  apply(compiler) {
    /**
     * @private
     * @type {ReturnType<Compiler["getInfrastructureLogger"]>}
     */
    this.logger = compiler.getInfrastructureLogger("webpack-cli");

    if (this.options.progress) {
      this.setupProgressPlugin(compiler);
    }

    if (this.options.hot) {
      this.setupHotPlugin(compiler);
    }

    if (this.options.prefetch) {
      this.setupPrefetchPlugin(compiler);
    }

    if (this.options.analyze) {
      this.setupBundleAnalyzerPlugin(compiler);
    }

    this.setupHelpfulOutput(compiler);
  }
}

module.exports = CLIPlugin;
