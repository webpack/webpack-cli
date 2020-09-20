const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

const resolveMode = (args) => {
    const {
        env: { NODE_ENV },
    } = process;
    const { mode } = args;
    let finalMode;
    /**
     * It determines the mode to pass to webpack compiler
     * @returns {string} The mode
     */
    if (NODE_ENV && (NODE_ENV === PRODUCTION || NODE_ENV === DEVELOPMENT)) {
        finalMode = NODE_ENV;
    } else if (mode) {
        finalMode = mode;
    }

    return {
        options: { mode: finalMode },
    };
};

module.exports = resolveMode;
