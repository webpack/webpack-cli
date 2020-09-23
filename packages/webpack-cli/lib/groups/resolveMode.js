const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

/*
Mode priority:
    - Mode flag
    - Mode from config
    - Mode form NODE_ENV
*/

const resolveMode = (args, configOptions) => {
    const {
        env: { NODE_ENV },
    } = process;
    const { mode } = args;
    const { mode: configMode } = configOptions;

    let finalMode;

    if (mode) {
        finalMode = mode;
    } else if (configMode) {
        finalMode = configMode;
    } else if (NODE_ENV && (NODE_ENV === PRODUCTION || NODE_ENV === DEVELOPMENT)) {
        finalMode = NODE_ENV;
    } else {
        finalMode = PRODUCTION;
    }

    return {
        options: { mode: finalMode },
    };
};

module.exports = resolveMode;
