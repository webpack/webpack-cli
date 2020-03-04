const GroupHelper = require('../utils/GroupHelper');
const { core, groups } = require('../utils/cli-flags');

class BasicGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.WEBPACK_OPTION_FLAGS = core
            .filter(coreFlag => {
                return coreFlag.group === groups.BASIC_GROUP;
            })
            .reduce((result, flagObject) => {
                result.push(flagObject.name);
                if (flagObject.alias) {
                    result.push(flagObject.alias);
                }
                return result;
            }, []);
        this._excuted = false;
    }
    resolveFlags() {
        const { args } = this;
        const { outputOptions, options } = this.opts;
        Object.keys(args).forEach(arg => {
            if (this.WEBPACK_OPTION_FLAGS.includes(arg)) {
                outputOptions[arg] = args[arg];
            }
            // TODO: to add once webpack bundle analyzer is installed, which is not at the moment
            // if (arg == 'analyze') {
            // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            // this.opts.options.plugins = [new BundleAnalyzerPlugin()];
            // }
            if (arg === 'sourcemap') {
                options.devtool = args[arg] || 'eval';
                outputOptions.devtool = args[arg];
            }
            if (arg === 'entry') {
                // first excute, get the default entry to void defaultEntry override config entry
                if (this._excuted === false) {
                    if (args[arg] === null)
                        options[arg] = this.resolveFilePath(args[arg], 'index.js');
                } else if (this._excuted === true) {
                    options[arg] = undefined;
                    if (args[arg] !== null)
                        options[arg] = this.resolveFilePath(args[arg], 'index.js');
                }
            }
        });
        if (outputOptions['dev']) {
            outputOptions['prod'] = undefined;
        }
        this._excuted = true;
    }

    run() {
        this.resolveFlags();
        return this.opts;
    }
}

module.exports = BasicGroup;
