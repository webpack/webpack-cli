const packageExists = require('./package-exists');
const cli = packageExists('webpack') ? require('webpack').cli : undefined;

const minimumHelpFlags = [
    'config',
    'config-name',
    'merge',
    'env',
    'mode',
    'watch',
    'watch-options-stdin',
    'stats',
    'devtool',
    'entry',
    'target',
    'progress',
    'json',
    'name',
    'output-path',
];

const builtInFlags = [
    // For configs
    {
        name: 'config',
        alias: 'c',
        type: String,
        multiple: true,
        description: 'Provide path to a webpack configuration file e.g. ./webpack.config.js.',
    },
    {
        name: 'config-name',
        type: String,
        multiple: true,
        description: 'Name of the configuration to use.',
    },
    {
        name: 'merge',
        alias: 'm',
        type: Boolean,
        description: "Merge two or more configurations using 'webpack-merge'.",
    },
    // Complex configs
    {
        name: 'env',
        type: (value, previous = {}) => {
            // This ensures we're only splitting by the first `=`
            const [allKeys, val] = value.split(/=(.+)/, 2);
            const splitKeys = allKeys.split(/\.(?!$)/);

            let prevRef = previous;

            splitKeys.forEach((someKey, index) => {
                if (!prevRef[someKey]) {
                    prevRef[someKey] = {};
                }

                if (typeof prevRef[someKey] === 'string') {
                    prevRef[someKey] = {};
                }

                if (index === splitKeys.length - 1) {
                    prevRef[someKey] = val || true;
                }

                prevRef = prevRef[someKey];
            });

            return previous;
        },
        multiple: true,
        description: 'Environment passed to the configuration when it is a function.',
    },

    // Adding more plugins
    {
        name: 'hot',
        alias: 'h',
        type: Boolean,
        negative: true,
        description: 'Enables Hot Module Replacement',
        negatedDescription: 'Disables Hot Module Replacement.',
    },
    {
        name: 'analyze',
        type: Boolean,
        multiple: false,
        description: 'It invokes webpack-bundle-analyzer plugin to get bundle information.',
    },
    {
        name: 'progress',
        type: [Boolean, String],
        description: 'Print compilation progress during build.',
    },
    {
        name: 'prefetch',
        type: String,
        description: 'Prefetch this request.',
    },

    // Output options
    {
        name: 'json',
        type: [String, Boolean],
        alias: 'j',
        description: 'Prints result as JSON or store it in a file.',
    },

    // For webpack@4
    {
        name: 'entry',
        type: String,
        multiple: true,
        description: 'The entry point(s) of your application e.g. ./src/main.js.',
    },
    {
        name: 'output-path',
        alias: 'o',
        type: String,
        description: 'Output location of the file generated by webpack e.g. ./dist/.',
    },
    {
        name: 'target',
        alias: 't',
        type: String,
        multiple: cli !== undefined,
        description: 'Sets the build target e.g. node.',
    },
    {
        name: 'devtool',
        type: String,
        negative: true,
        alias: 'd',
        description: 'Determine source maps to use.',
        negatedDescription: 'Do not generate source maps.',
    },
    {
        name: 'mode',
        type: String,
        description: 'Defines the mode to pass to webpack.',
    },
    {
        name: 'name',
        type: String,
        description: 'Name of the configuration. Used when loading multiple configurations.',
    },
    {
        name: 'stats',
        type: [String, Boolean],
        negative: true,
        description: 'It instructs webpack on how to treat the stats e.g. verbose.',
        negatedDescription: 'Disable stats output.',
    },
    {
        name: 'watch',
        type: Boolean,
        negative: true,
        alias: 'w',
        description: 'Watch for files changes.',
        negatedDescription: 'Do not watch for file changes.',
    },
    {
        name: 'watch-options-stdin',
        type: Boolean,
        negative: true,
        description: 'Stop watching when stdin stream has ended.',
        negatedDescription: 'Do not stop watching when stdin stream has ended.',
    },
];

// Extract all the flags being exported from core.
// A list of cli flags generated by core can be found here https://github.com/webpack/webpack/blob/master/test/__snapshots__/Cli.test.js.snap
const coreFlags = cli
    ? Object.entries(cli.getArguments()).map(([flag, meta]) => {
          if (meta.simpleType === 'string') {
              meta.type = String;
          } else if (meta.simpleType === 'number') {
              meta.type = Number;
          } else {
              meta.type = Boolean;
              meta.negative = !flag.endsWith('-reset');
          }

          const inBuiltIn = builtInFlags.find((builtInFlag) => builtInFlag.name === flag);

          if (inBuiltIn) {
              return { ...meta, name: flag, group: 'core', ...inBuiltIn };
          }

          return { ...meta, name: flag, group: 'core' };
      })
    : [];
const flags = []
    .concat(builtInFlags.filter((builtInFlag) => !coreFlags.find((coreFlag) => builtInFlag.name === coreFlag.name)))
    .concat(coreFlags)
    .map((option) => {
        option.help = minimumHelpFlags.includes(option.name) ? 'minimum' : 'verbose';

        return option;
    });

module.exports = { cli, flags };
