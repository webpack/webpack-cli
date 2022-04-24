```
Usage: webpack [entries...] [options]
Alternative usage to run commands: webpack [command] [options]

The build tool for modern web applications.

Options:
  -c, --config <value...>                                                            Provide path to a webpack configuration file e.g. ./webpack.config.js.
  --config-name <value...>                                                           Name of the configuration to use.
  -m, --merge                                                                        Merge two or more configurations using 'webpack-merge'.
  --env <value...>                                                                   Environment passed to the configuration when it is a function.
  --node-env <value>                                                                 Sets process.env.NODE_ENV to the specified value.
  -h, --hot [value]                                                                  Enables Hot Module Replacement
  --no-hot                                                                           Disables Hot Module Replacement.
  --analyze                                                                          It invokes webpack-bundle-analyzer plugin to get bundle information.
  --progress [value]                                                                 Print compilation progress during build.
  --prefetch <value>                                                                 Prefetch this request.
  -j, --json [value]                                                                 Prints result as JSON or store it in a file.
  --no-amd                                                                           Negative 'amd' option.
  --bail                                                                             Report the first error as a hard error instead of tolerating it.
  --no-bail                                                                          Negative 'bail' option.
  --cache                                                                            Enable in memory caching. Disable caching.
  --no-cache                                                                         Negative 'cache' option.
  --cache-cache-unaffected                                                           Additionally cache computation of modules that are unchanged and reference only unchanged modules.
  --no-cache-cache-unaffected                                                        Negative 'cache-cache-unaffected' option.
  --cache-max-generations <value>                                                    Number of generations unused cache entries stay in memory cache at minimum (1 = may be removed after unused for a single compilation, ..., Infinity: kept forever).
  --cache-type <value>                                                               In memory caching. Filesystem caching.
  --cache-allow-collecting-memory                                                    Allows to collect unused memory allocated during deserialization. This requires copying data into smaller buffers and has a performance cost.
  --no-cache-allow-collecting-memory                                                 Negative 'cache-allow-collecting-memory' option.
  --cache-cache-directory <value>                                                    Base directory for the cache (defaults to node_modules/.cache/webpack).
  --cache-cache-location <value>                                                     Locations for the cache (defaults to cacheDirectory / name).
  --cache-compression <value>                                                        Compression type used for the cache files.
  --no-cache-compression                                                             Negative 'cache-compression' option.
  --cache-hash-algorithm <value>                                                     Algorithm used for generation the hash (see node.js crypto package).
  --cache-idle-timeout <value>                                                       Time in ms after which idle period the cache storing should happen.
  --cache-idle-timeout-after-large-changes <value>                                   Time in ms after which idle period the cache storing should happen when larger changes has been detected (cumulative build time > 2 x avg cache store time).
  --cache-idle-timeout-for-initial-store <value>                                     Time in ms after which idle period the initial cache storing should happen.
  --cache-immutable-paths <value...>                                                 A RegExp matching an immutable directory (usually a package manager cache directory, including the tailing slash) A path to an immutable directory (usually a package manager cache directory).
  --cache-immutable-paths-reset                                                      Clear all items provided in 'cache.immutablePaths' configuration. List of paths that are managed by a package manager and contain a version or hash in its path so all files are immutable.
  --cache-managed-paths <value...>                                                   A RegExp matching a managed directory (usually a node_modules directory, including the tailing slash) A path to a managed directory (usually a node_modules directory).
  --cache-managed-paths-reset                                                        Clear all items provided in 'cache.managedPaths' configuration. List of paths that are managed by a package manager and can be trusted to not be modified otherwise.
  --cache-max-age <value>                                                            Time for which unused cache entries stay in the filesystem cache at minimum (in milliseconds).
  --cache-max-memory-generations <value>                                             Number of generations unused cache entries stay in memory cache at minimum (0 = no memory cache used, 1 = may be removed after unused for a single compilation, ..., Infinity: kept forever). Cache entries will be deserialized from disk when removed from memory cache.
  --cache-memory-cache-unaffected                                                    Additionally cache computation of modules that are unchanged and reference only unchanged modules in memory.
  --no-cache-memory-cache-unaffected                                                 Negative 'cache-memory-cache-unaffected' option.
  --cache-name <value>                                                               Name for the cache. Different names will lead to different coexisting caches.
  --cache-profile                                                                    Track and log detailed timing information for individual cache items.
  --no-cache-profile                                                                 Negative 'cache-profile' option.
  --cache-store <value>                                                              When to store data to the filesystem. (pack: Store data when compiler is idle in a single file).
  --cache-version <value>                                                            Version of the cache data. Different versions won't allow to reuse the cache and override existing content. Update the version when config changed in a way which doesn't allow to reuse cache. This will invalidate the cache.
  --context <value>                                                                  The base directory (absolute path!) for resolving the `entry` option. If `output.pathinfo` is set, the included pathinfo is shortened to this directory.
  --dependencies <value...>                                                          References to another configuration to depend on.
  --dependencies-reset                                                               Clear all items provided in 'dependencies' configuration. References to other configurations to depend on.
  -d, --devtool <value>                                                              Determine source maps to use.
  --no-devtool                                                                       Do not generate source maps.
  --entry <value...>
```
