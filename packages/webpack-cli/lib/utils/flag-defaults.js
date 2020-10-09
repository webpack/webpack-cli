const assignFlagDefaults = (compilerConfig, parsedArgs) => {
    const finalConfig = { ...compilerConfig };
    // eslint-disable-next-line no-prototype-builtins
    const hasCache = finalConfig.hasOwnProperty('cache');
    if (hasCache && parsedArgs.config) {
        if (finalConfig.cache && finalConfig.cache.type === 'filesystem') {
            finalConfig.cache = {
                ...finalConfig.cache,
                buildDependencies: {
                    config: parsedArgs.config,
                },
            };
        }
    }
    return finalConfig;
};

module.exports = assignFlagDefaults;
