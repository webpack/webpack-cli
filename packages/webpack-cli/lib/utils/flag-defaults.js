const cacheDefaults = (finalConfig, parsedArgs, outputOptions) => {
    // eslint-disable-next-line no-prototype-builtins
    const hasCache = finalConfig.hasOwnProperty('cache');
    let cacheConfig = {};
    if (hasCache && (parsedArgs.config || outputOptions.defaultConfig)) {
        if (finalConfig.cache && finalConfig.cache.type === 'filesystem') {
            cacheConfig.buildDependencies = {
                config: parsedArgs.config || outputOptions.defaultConfig,
            };
        }
        return { cache: cacheConfig };
    }
    console.log({ cacheConfig, outputOptions });
    return cacheConfig;
};

const assignFlagDefaults = (compilerConfig, parsedArgs, outputOptions) => {
    if (Array.isArray(compilerConfig)) {
        return compilerConfig.map((config) => cacheDefaults(config, parsedArgs, outputOptions));
    }
    return cacheDefaults(compilerConfig, parsedArgs, outputOptions);
};

module.exports = assignFlagDefaults;
