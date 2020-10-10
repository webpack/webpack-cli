const cacheDefaults = (finalConfig, parsedArgs) => {
    // eslint-disable-next-line no-prototype-builtins
    const hasCache = finalConfig.hasOwnProperty('cache');
    let cacheConfig = {};
    if (hasCache && parsedArgs.config) {
        if (finalConfig.cache && finalConfig.cache.type === 'filesystem') {
            cacheConfig.buildDependencies = {
                config: parsedArgs.config,
            };
        }
        return { cache: cacheConfig };
    }
    return cacheConfig;
};

const assignFlagDefaults = (compilerConfig, parsedArgs) => {
    if (Array.isArray(compilerConfig)) {
        return compilerConfig.map((config) => cacheDefaults(config, parsedArgs));
    }
    return cacheDefaults(compilerConfig, parsedArgs);
};

module.exports = assignFlagDefaults;
