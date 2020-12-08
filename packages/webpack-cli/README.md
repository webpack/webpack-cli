<div align="center">
    <a href="https://github.com/webpack/webpack-cli">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>

# webpack CLI

The official CLI of webpack

## About

webpack CLI provides a flexible set of commands for developers to increase speed when setting up a custom webpack project. As of webpack v4, webpack is not expecting a configuration file, but often developers want to create a more custom webpack configuration based on their use-cases and needs. webpack CLI addresses these needs by providing a set of tools to improve the setup of custom webpack configuration.

## How to install

When you have followed the [Getting Started](https://webpack.js.org/guides/getting-started/) guide of webpack then webpack CLI is already installed!

Otherwise

```bash
npm install --save-dev webpack-cli
```

or

```bash
yarn add webpack-cli --dev
```

## Supported arguments and commands

### Help Usage

You display basic commands and arguments -

```bash
npx webpack-cli --help
```

To display all supported commands and arguments -

```bash
npx webpack-cli --help=verbose
```

or

```bash
npx webpack-cli --help verbose
```

### Available Commands

```
  init | c      Initialize a new webpack configuration
  migrate | m   Migrate a configuration to a new version
  loader | l    Scaffold a loader repository
  plugin | p    Scaffold a plugin repository
  info | i      Outputs information about your system and dependencies
  serve | s     Run the webpack Dev Server
```

### webpack 4

```
  --analyze                     It invokes webpack-bundle-analyzer plugin to get bundle information
  --entry string[]              The entry point(s) of your application.
  -c, --config string[]         Provide path to webpack configuration file(s)
  --config-name string[]        Name of the configuration to use
  -m, --merge                   Merge several configurations using webpack-merge
  --progress string, boolean    Print compilation progress during build
  --color                       Enables colors on console
  --no-color                    Disable colors on console
  --env string[]                Environment passed to the configuration when it is a function
  --name string                 Name of the configuration. Used when loading multiple configurations
  --help                        Outputs list of supported flags
  -o, --output-path string      Output location of the generated bundle
  -t, --target string[]         Sets the build target
  -w, --watch                   Watch for files changes
  --no-watch                    Do not watch for file changes
  -h, --hot                     Enables Hot Module Replacement
  --no-hot                      Disables Hot Module Replacement
  -d, --devtool string          Controls if and how source maps are generated.
  --no-devtool                  Do not generate source maps
  --prefetch string             Prefetch this request
  -j, --json string, boolean    Prints result as JSON or store it in a file
  --mode string                 Defines the mode to pass to webpack
  -v, --version                 Get current version
  --stats string, boolean       It instructs webpack on how to treat the stats
  --no-stats                    Disables stats output
```

### webpack 5

```
  --amd                                                       You can pass `false` to disable AMD support.
  --bail                                                      Report the first error as a hard error instead of tolerating it.
  --cache                                                     Enable in memory caching. Disable caching.
  --cache-immutable-paths string[]                            A path to a immutable directory (usually a package manager cache directory).
  --cache-immutable-paths-reset                               Clear all items provided in configuration. List of paths that are managed by
                                                              a package manager and contain a version or hash in its path so all files are
                                                              immutable.
  --cache-type string                                         In memory caching. Filesystem caching.
  --cache-cache-directory string                              Base directory for the cache (defaults to node_modules/.cache/webpack).
  --cache-cache-location string                               Locations for the cache (defaults to cacheDirectory / name).
  --cache-hash-algorithm string                               Algorithm used for generation the hash (see node.js crypto package).
  --cache-idle-timeout number                                 Time in ms after which idle period the cache storing should happen (only for
                                                              store: 'pack' or 'idle').
  --cache-idle-timeout-for-initial-store number               Time in ms after which idle period the initial cache storing should happen
                                                              (only for store: 'pack' or 'idle').
  --cache-name string                                         Name for the cache. Different names will lead to different coexisting caches.
  --cache-store string                                        When to store data to the filesystem. (pack: Store data when compiler is idle
                                                              in a single file).
  --cache-version string                                      Version of the cache data. Different versions won't allow to reuse the cache
                                                              and override existing content. Update the version when config changed in a
                                                              way which doesn't allow to reuse cache. This will invalidate the cache.
  --context string                                            The base directory (absolute path!) for resolving the `entry` option. If
                                                              `output.pathinfo` is set, the included pathinfo is shortened to this
                                                              directory.
  --dependencies string[]                                     References to another configuration to depend on.
  --dependencies-reset                                        Clear all items provided in configuration. References to other configurations
                                                              to depend on.
  --devtool string                                            A developer tool to enhance debugging (false | eval |
                                                              [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map).
  --entry-reset                                               Clear all items provided in configuration. All modules are loaded upon
                                                              startup. The last one is exported.
  --experiments-asset                                         Allow module type 'asset' to generate assets.
  --experiments-async-web-assembly                            Support WebAssembly as asynchronous EcmaScript Module.
  --experiments-import-async                                  Allow 'import/export' syntax to import async modules.
  --experiments-import-await                                  Allow 'import/export await' syntax to import async modules.
  --experiments-mjs                                           Support .mjs files as way to define strict ESM file (node.js).
  --experiments-output-module                                 Allow output javascript files as module source type.
  --experiments-sync-web-assembly                             Support WebAssembly as synchronous EcmaScript Module (outdated).
  --experiments-top-level-await                               Allow using top-level-await in EcmaScript Modules.
  --externals string[]                                        Every matched dependency becomes external. An exact matched dependency
                                                              becomes external. The same string is used as external dependency.
  --externals-presets-electron                                Treat common electron built-in modules in main and preload context like 'electron',
                                                              'ipc' or 'shell' as external and load them via require() when used.
  --externals-presets-electron-main                           Treat electron built-in modules in the main context like 'app', 'ipc-main' or
                                                              'shell' as external and load them via require() when used.
  --externals-presets-electron-preload                        Treat electron built-in modules in the preload context like 'web-frame',
                                                              'ipc-renderer' or 'shell' as external and load them via require() when used.
  --externals-presets-electron-renderer                       Treat electron built-in modules in the renderer context like 'web-frame',
                                                              'ipc-renderer' or 'shell' as external and load them via require() when used.
  --externals-presets-node                                    Treat node.js built-in modules like fs, path or vm as external and load them via
                                                              require() when used.
  --externals-presets-nwjs                                    Treat NW.js legacy nw.gui module as external and load it via require() when used.
  --externals-presets-web                                     Treat references to 'http(s)://...' and 'std:...' as external and load them via import
                                                              when used (Note that this changes execution order as externals are executed before
                                                              any other code in the chunk).
  --externals-presets-web-async                               Treat references to 'http(s)://...' and 'std:...' as external and load them via async
                                                              import() when used (Note that this external type is an async module, which has various
                                                              effects on the execution).
  --externals-reset                                           Clear all items provided in configuration. Specify dependencies that
                                                              shouldn't be resolved by webpack, but should become dependencies of the
                                                              resulting bundle. The kind of the dependency depends on
                                                              `output.libraryTarget`.
  --externals-type string                                     Specifies the default type of externals ('amd*', 'umd*', 'system' and 'jsonp'
                                                              depend on output.libraryTarget set to the same value).
  --ignore-warnings string[]                                  A RegExp to select the warning message.
  --ignore-warnings-file string[]                             A RegExp to select the origin file for the warning.
  --ignore-warnings-message string[]                          A RegExp to select the warning message.
  --ignore-warnings-module string[]                           A RegExp to select the origin module for the warning.
  --ignore-warnings-reset                                     Clear all items provided in configuration. Ignore specific warnings.
  --infrastructure-logging-debug string[]                     Enable/Disable debug logging for all loggers. Enable debug logging for
                                                              specific loggers.
  --infrastructure-logging-debug-reset                        Clear all items provided in configuration. Enable debug logging for specific
                                                              loggers.
  --infrastructure-logging-level string                       Log level.
  --module-expr-context-critical                              Enable warnings for full dynamic dependencies.
  --module-expr-context-recursive                             Enable recursive directory lookup for full dynamic dependencies.
  --module-expr-context-reg-exp string                        Sets the default regular expression for full dynamic dependencies.
  --module-expr-context-request string                        Set the default request for full dynamic dependencies.
  --module-no-parse string[]                                  A regular expression, when matched the module is not parsed. An absolute
                                                              path, when the module starts with this path it is not parsed.
  --module-no-parse-reset                                     Clear all items provided in configuration. Don't parse files matching. It's
                                                              matched against the full resolved request.
  --module-rules-compiler string[]                            Match the child compiler name.
  --module-rules-enforce string[]                             Enforce this rule as pre or post step.
  --module-rules-exclude string[]                             Shortcut for resource.exclude.
  --module-rules-include string[]                             Shortcut for resource.include.
  --module-rules-issuer string[]                              Match the issuer of the module (The module pointing to this module).
  --module-rules-loader string[]                              A loader request.
  --module-rules-mimetype string[]                            Match module mimetype when load from Data URI.
  --module-rules-options string[]                             Options passed to a loader.
  --module-rules-real-resource string[]                       Match the real resource path of the module.
  --module-rules-resource string[]                            Match the resource path of the module.
  --module-rules-resource-fragment string[]                   Match the resource fragment of the module.
  --module-rules-resource-query string[]                      Match the resource query of the module.
  --module-rules-side-effects                                 Flags a module as with or without side effects.
  --module-rules-test string[]                                Shortcut for resource.test.
  --module-rules-type string[]                                Module type to use for the module.
  --module-rules-use-ident string[]                           Unique loader options identifier.
  --module-rules-use-loader string[]                          A loader request.
  --module-rules-use-options string[]                         Options passed to a loader.
  --module-rules-use string[]                                 A loader request.
  --module-rules-reset                                        Clear all items provided in configuration. A list of rules.
  --module-strict-export-presence                             Emit errors instead of warnings when imported names don't exist in imported
                                                              module.
  --module-strict-this-context-on-imports                     Handle the this context correctly according to the spec for namespace
                                                              objects.
  --module-unknown-context-critical                           Enable warnings when using the require function in a not statically analyse-
                                                              able way.
  --module-unknown-context-recursive                          Enable recursive directory lookup when using the require function in a not
                                                              statically analyse-able way.
  --module-unknown-context-reg-exp string                     Sets the regular expression when using the require function in a not
                                                              statically analyse-able way.
  --module-unknown-context-request string                     Sets the request when using the require function in a not statically analyse-
                                                              able way.
  --module-unsafe-cache                                       Cache the resolving of module requests.
  --module-wrapped-context-critical                           Enable warnings for partial dynamic dependencies.
  --module-wrapped-context-recursive                          Enable recursive directory lookup for partial dynamic dependencies.
  --module-wrapped-context-reg-exp string                     Set the inner regular expression for partial dynamic dependencies.
  --name string                                               Name of the configuration. Used when loading multiple configurations.
  --node                                                      Include polyfills or mocks for various node stuff.
  --node-dirname string                                       Include a polyfill for the '__dirname' variable.
  --node-filename string                                      Include a polyfill for the '__filename' variable.
  --node-global                                               Include a polyfill for the 'global' variable.
  --optimization-check-wasm-types                             Check for incompatible wasm types when importing/exporting from/to ESM.
  --optimization-chunk-ids string                             Define the algorithm to choose chunk ids (named: readable ids for better
                                                              debugging, deterministic: numeric hash ids for better long term caching,
                                                              size: numeric ids focused on minimal initial download size, total-size:
                                                              numeric ids focused on minimal total download size, false: no algorithm used,
                                                              as custom one can be provided via plugin).
  --optimization-concatenate-modules                          Concatenate modules when possible to generate less modules, more efficient
                                                              code and enable more optimizations by the minimizer.
  --optimization-emit-on-errors                               Emit assets even when errors occur. Critical errors are emitted into the
                                                              generated code and will case errors at runtime.
  --optimization-flag-included-chunks                         Also flag chunks as loaded which contain a subset of the modules.
  --optimization-inner-graph                                  Creates a module-internal dependency graph for top level symbols, exports and
                                                              imports, to improve unused exports detection.
  --optimization-mangle-exports                               Rename exports when possible to generate shorter code (depends on
                                                              optimization.usedExports and optimization.providedExports).
  --optimization-mangle-wasm-imports                          Reduce size of WASM by changing imports to shorter strings.
  --optimization-merge-duplicate-chunks                       Merge chunks which contain the same modules.
  --optimization-minimize                                     Enable minimizing the output. Uses optimization.minimizer.
  --optimization-module-ids string                            Define the algorithm to choose module ids (natural: numeric ids in order of
                                                              usage, named: readable ids for better debugging, hashed: (deprecated) short
                                                              hashes as ids for better long term caching, deterministic: numeric hash ids
                                                              for better long term caching, size: numeric ids focused on minimal initial
                                                              download size, false: no algorithm used, as custom one can be provided via
                                                              plugin).
  --optimization-node-env string                              Set process.env.NODE_ENV to a specific value.
  --optimization-portable-records                             Generate records with relative paths to be able to move the context folder.
  --optimization-provided-exports                             Figure out which exports are provided by modules to generate more efficient
                                                              code.
  --optimization-remove-available-modules                     Removes modules from chunks when these modules are already included in all
                                                              parents.
  --optimization-remove-empty-chunks                          Remove chunks which are empty.
  --optimization-runtime-chunk string                         Create an additional chunk which contains only the webpack runtime and chunk
                                                              hash maps.
  --optimization-runtime-chunk-name string                    The name or name factory for the runtime chunks.
  --optimization-side-effects                                 Skip over modules which are flagged to contain no side effects when exports
                                                              are not used.
  --optimization-split-chunks                                 Optimize duplication and caching by splitting chunks by shared modules and
                                                              cache group.
  --optimization-split-chunks-chunks string                   Select chunks for determining shared modules (defaults to "async", "initial"
                                                              and "all" requires adding these chunks to the HTML).
  --optimization-split-chunks-default-size-types string       Size type, like 'javascript', 'webassembly'.
  --optimization-split-chunks-default-size-types-reset        Clear all items provided in configuration. Sets the size types which are used when a
                                                              number is used for sizes.

  --optimization-split-chunks-enforce-size-threshold string                         Size of the javascript part of the chunk.
  --optimization-split-chunks-fallback-cache-group-automatic-name-delimiter string  Sets the name delimiter for created chunks
  --optimization-split-chunks-fallback-cache-group-max-async-size number            Size of the javascript part of the chunk
  --optimization-split-chunks-fallback-cache-group-max-initial-size number          Size of the javascript part of the chunk.
  --optimization-split-chunks-fallback-cache-group-max-size number                  Size of the javascript part of the chunk.
  --optimization-split-chunks-fallback-cache-group-min-size number                  Size of the javascript part of the chunk.

  --optimization-split-chunks-automatic-name-delimiter string Sets the name delimiter for created chunks
  --optimization-split-chunks-filename string                 Sets the template for the filename for created chunks.
  --optimization-split-chunks-hide-path-info                  Prevents exposing path info when creating names for parts splitted by
                                                              maxSize.
  --optimization-split-chunks-max-async-requests number       Maximum number of requests which are accepted for on-demand loading.
  --optimization-split-chunks-max-async-size number           Size of the javascript part of the chunk.
  --optimization-split-chunks-max-initial-requests number     Maximum number of initial chunks which are accepted for an entry point.
  --optimization-split-chunks-max-initial-size number         Size of the javascript part of the chunk.
  --optimization-split-chunks-max-size number                 Size of the javascript part of the chunk.
  --optimization-split-chunks-min-chunks number               Minimum number of times a module has to be duplicated until it's considered
                                                              for splitting.
  --optimization-split-chunks-min-remaining-size number       Size of the javascript part of the chunk.
  --optimization-split-chunks-min-size number                 Size of the javascript part of the chunk.
  --optimization-split-chunks-name string                     Give chunks created a name (chunks with equal name are merged).
  --optimization-used-exports                                 Figure out which exports are used by modules to mangle export names, omit
                                                              unused exports and generate more efficient code.
  --output-asset-module-filename string                       The filename of asset modules as relative path inside the `output.path`
                                                              directory.
  --output-charset                                            Add charset attribute for script tag.
  --output-chunk-filename string                              The filename of non-initial chunks as relative path inside the `output.path`
                                                              directory.
  --output-chunk-format string                                The format of chunks (formats included by default are 'array-push'
                                                              (web/WebWorker), 'commonjs' (node.js), but others might be added by plugins).
  --output-chunk-load-timeout number                          Number of milliseconds before chunk request expires.
  --output-chunk-loading string                               The method of loading chunks (methods included by default are 'jsonp' (web),
                                                              'importScripts' (WebWorker), 'require' (sync node.js), 'async-node' (async
                                                              node.js), but others might be added by plugins).
  --output-chunk-loading-global string                        The global variable used by webpack for loading of chunks.
  --output-compare-before-emit                                Check if to be emitted file already exists and have the same content before
                                                              writing to output filesystem.
  --output-cross-origin-loading string                        This option enables cross-origin loading of chunks.
  --output-devtool-fallback-module-filename-template string   Similar to `output.devtoolModuleFilenameTemplate`, but used in the case of
                                                              duplicate module identifiers.
  --output-devtool-module-filename-template string            Filename template string of function for the sources array in a generated
                                                              SourceMap.
  --output-devtool-namespace string                           Module namespace to use when interpolating filename template string for the
                                                              sources array in a generated SourceMap. Defaults to `output.library` if not
                                                              set. It's useful for avoiding runtime collisions in sourcemaps from multiple
                                                              webpack projects built as libraries.
  --output-enabled-chunk-loading-types string[]               The method of loading chunks (methods included by default are 'jsonp' (web),
                                                              'importScripts' (WebWorker), 'require' (sync node.js), 'async-node' (async
                                                              node.js), but others might be added by plugins).
  --output-enabled-chunk-loading-types-reset                  Clear all items provided in configuration. List of chunk loading types
                                                              enabled for use by entry points.
  --output-enabled-library-types string[]                     Type of library (types included by default are 'var', 'module', 'assign',
                                                              'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-
                                                              module', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others
                                                              might be added by plugins).
  --output-enabled-library-types-reset                        Clear all items provided in configuration. List of library types enabled for
                                                              use by entry points.
  --output-enabled-wasm-loading-types string[]                The method of loading WebAssembly Modules (methods included by default are
                                                              'fetch' (web/WebWorker), 'async-node' (node.js), but others might be added by
                                                              plugins).
  --output-enabled-wasm-loading-types-reset                   Clear all items provided in configuration. List of wasm loading types enabled
                                                              for use by entry points.
  --output-environment-arrow-function                         The environment supports arrow functions ('() => { ... }').
  --output-environment-big-int-literal                        The environment supports BigInt as literal (123n).
  --output-environment-const                                  The environment supports const and let for variable declarations.
  --output-environment-destructuring                          The environment supports destructuring ('{ a, b } = obj').
  --output-environment-dynamic-import                         The environment supports an async import() function to import EcmaScript
                                                              modules.
  --output-environment-for-of                                 The environment supports 'for of' iteration ('for (const x of array) { ...
                                                              }').
  --output-environment-module                                 The environment supports EcmaScript Module syntax to import EcmaScript
                                                              modules (import ... from '...').
  --output-filename string                                    Specifies the name of each output file on disk. You must **not** specify an
                                                              absolute path here! The `output.path` option determines the location on disk
                                                              the files are written to, filename is used solely for naming the individual
                                                              files.
  --output-global-object string                               An expression which is used to address the global object/scope in runtime
                                                              code.
  --output-hash-digest string                                 Digest type used for the hash.
  --output-hash-digest-length number                          Number of chars which are used for the hash.
  --output-hash-function string                               Algorithm used for generation the hash (see node.js crypto package).
  --output-hash-salt string                                   Any string which is added to the hash to salt it.
  --output-hot-update-chunk-filename string                   The filename of the Hot Update Chunks. They are inside the output.path
                                                              directory.
  --output-hot-update-global string                           The global variable used by webpack for loading of hot update chunks.
  --output-hot-update-main-filename string                    The filename of the Hot Update Main File. It is inside the `output.path`
                                                              directory.
  --output-iife                                               Wrap javascript code into IIFE's to avoid leaking into global scope.
  --output-import-function-name string                        The name of the native import() function (can be exchanged for a polyfill).
  --output-import-meta-name string                            The name of the native import.meta object (can be exchanged for a polyfill).
  --output-library string[]                                   A part of the library name.
  --output-library-reset                                      Clear all items provided in configuration. The name of the library (some
                                                              types allow unnamed libraries too).
  --output-library-amd string                                 Name of the exposed AMD library in the UMD.
  --output-library-commonjs string                            Name of the exposed commonjs export in the UMD.
  --output-library-root string[]                              Part of the name of the property exposed globally by a UMD library.
  --output-library-root-reset                                 Clear all items provided in configuration. Name of the property exposed
                                                              globally by a UMD library.
  --output-library-auxiliary-comment string                   Append the same comment above each import style.
  --output-library-auxiliary-comment-amd string               Set comment for `amd` section in UMD.
  --output-library-auxiliary-comment-commonjs string          Set comment for `commonjs` (exports) section in UMD.
  --output-library-auxiliary-comment-commonjs2 string         Set comment for `commonjs2` (module.exports) section in UMD.
  --output-library-auxiliary-comment-root string              Set comment for `root` (global variable) section in UMD.
  --output-library-export string[]                            Part of the export that should be exposed as library.
  --output-library-export-reset                               Clear all items provided in configuration. Specify which export should be
                                                              exposed as library.
  --output-library-name string[]                              A part of the library name.
  --output-library-name-reset                                 Clear all items provided in configuration. The name of the library (some
                                                              types allow unnamed libraries too).
  --output-library-name-amd string                            Name of the exposed AMD library in the UMD.
  --output-library-name-commonjs string                       Name of the exposed commonjs export in the UMD.
  --output-library-name-root string[]                         Part of the name of the property exposed globally by a UMD library.
  --output-library-name-root-reset                            Clear all items provided in configuration. Name of the property exposed
                                                              globally by a UMD library.
  --output-library-type string                                Type of library (types included by default are 'var', 'module', 'assign',
                                                              'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-
                                                              module', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others
                                                              might be added by plugins).
  --output-library-umd-named-define                           If `output.libraryTarget` is set to umd and `output.library` is set, setting
                                                              this to true will name the AMD module.
  --output-module                                             Output javascript files as module source type.
  -o, --output-path string                                    Output location of the file generated by webpack e.g. ./dist/
  --output-pathinfo                                           Include comments with information about the modules.
  --output-public-path string                                 The `publicPath` specifies the public URL address of the output files when
                                                              referenced in a browser.
  --output-script-type string                                 This option enables loading async chunks via a custom script type, such as
                                                              script type="module".
  --output-source-map-filename string                         The filename of the SourceMaps for the JavaScript files. They are inside the
                                                              `output.path` directory.
  --output-source-prefix string                               Prefixes every line of the source in the bundle with this string.
  --output-strict-module-exception-handling                   Handles exceptions in module loading correctly at a performance cost.
  --output-unique-name string                                 A unique name of the webpack build to avoid multiple webpack runtimes to
                                                              conflict when using globals.
  --output-wasm-loading string                                The method of loading WebAssembly Modules (methods included by default are
                                                              'fetch' (web/WebWorker), 'async-node' (node.js), but others might be added by
                                                              plugins).
  --output-webassembly-module-filename string                 The filename of WebAssembly modules as relative path inside the `output.path`
                                                              directory.
  --output-worker-chunk-loading string                        The method of loading chunks (methods included by default are 'jsonp' (web),
                                                              'importScripts' (WebWorker), 'require' (sync node.js), 'async-node' (async
                                                              node.js), but others might be added by plugins).
  --output-worker-wasm-loading string                         The method of loading WebAssembly Modules (methods included by default are
                                                              'fetch' (web/WebWorker), 'async-node' (node.js), but others migby
                                                              plugins).
  --parallelism number                                        The number of parallel processed modules in the compilation.
  --performance                                               Configuration for web performance recommendations.
  --performance-hints string                                  Sets the format of the hints: warnings, errors or nothing at all.
  --performance-max-asset-size number                         File size limit (in bytes) when exceeded, that webpack will provide
                                                              performance hints.
  --performance-max-entrypoint-size number                    Total size of an entry point (in bytes).
  --profile                                                   Capture timing information for each module.
  --records-input-path string                                 Store compiler state to a json file.
  --records-output-path string                                Load compiler state from a json file.
  --records-path string                                       Store/Load compiler state from/to a json file. This will result in persistent
                                                              ids of modules and chunks. An absolute path is expected. `recordsPath` is
                                                              used for `recordsInputPath` and `recordsOutputPath` if they left undefined.
  --resolve-alias-alias string[]                              Ignore request (replace with empty module). New request.
  --resolve-alias-name string[]                               Request to be redirected.
  --resolve-alias-only-module                                 Redirect only exact matching request.
  --resolve-alias-reset                                       Clear all items provided in configuration. Redirect module requests.
  --resolve-alias-fields string[]                             Field in the description file (usually package.json) which are used to
                                                              redirect requests inside the module.
  --resolve-alias-fields-reset                                Clear all items provided in configuration. Fields in the description file
                                                              (usually package.json) which are used to redirect requests inside the module.
  --resolve-cache                                             Enable caching of successfully resolved requests (cache entries are
                                                              revalidated).
  --resolve-cache-with-context                                Include the context information in the cache identifier when caching.
  --resolve-condition-names string[]                          Condition names for exports field entry point.
  --resolve-condition-names-reset                             Clear all items provided in configuration. Condition names for exports field
                                                              entry point.
  --resolve-description-files string[]                        Filename used to find a description file (like a package.json).
  --resolve-description-files-reset                           Clear all items provided in configuration. Filenames used to find a
                                                              description file (like a package.json).
  --resolve-enforce-extension                                 Enforce the resolver to use one of the extensions from the extensions option
                                                              (User must specify requests without extension).
  --resolve-exports-fields string[]                           Field name from the description file (usually package.json) which is used to
                                                              provide entry points of a package.
  --resolve-exports-fields-reset                              Clear all items provided in configuration. Field names from the description
                                                              file (usually package.json) which are used to provide entry points of a
                                                              package.
  --resolve-extensions string[]                               Extension added to the request when trying to find the file.
  --resolve-extensions-reset                                  Clear all items provided in configuration. Extensions added to the request
                                                              when trying to find the file.
  --resolve-fallback-alias string[]                           Ignore request (replace with empty module). New request.
  --resolve-fallback-name string[]                            Request to be redirected.
  --resolve-fallback-only-module                              Redirect only exact matching request.
  --resolve-fallback-reset                                    Clear all items provided in configuration. Redirect module requests.
  --resolve-fully-specified                                   Treats the request specified by the user as fully specified, meaning no
                                                              extensions are added and the mainFiles in directories are not resolved (This
                                                              doesn't affect requests from mainFields, aliasFields or aliases).
  --resolve-main-fields string[]                              Field name from the description file (package.json) which are used to find
                                                              the default entry point.
  --resolve-main-fields-reset                                 Clear all items provided in configuration. Field names from the description
                                                              file (package.json) which are used to find the default entry point.
  --resolve-main-files string[]                               Filename used to find the default entry point if there is no description file
                                                              or main field.
  --resolve-main-files-reset                                  Clear all items provided in configuration. Filenames used to find the default
                                                              entry point if there is no description file or main field.
  --resolve-modules string[]                                  Folder name or directory path where to find modules.
  --resolve-modules-reset                                     Clear all items provided in configuration. Folder names or directory paths
                                                              where to find modules.
  --resolve-restrictions string[]                             Resolve restriction. Resolve result must fulfill this restriction.
  --resolve-restrictions-reset                                Clear all items provided in configuration. A list of resolve restrictions.
                                                              Resolve results must fulfill all of these restrictions to resolve
                                                              successfully. Other resolve paths are taken when restrictions are not met.
  --resolve-roots string[]                                    Directory in which requests that are server-relative URLs (starting with '/')
                                                              are resolved.
  --resolve-roots-reset                                       Clear all items provided in configuration. A list of directories in which
                                                              requests that are server-relative URLs (starting with '/') are resolved. On
                                                              non-windows system these requests are tried to resolve as absolute path
                                                              first.
  --resolve-symlinks                                          Enable resolving symlinks to the original location.
  --resolve-unsafe-cache                                      Enable caching of successfully resolved requests (cache entries are not
                                                              revalidated).
  --resolve-use-sync-file-system-calls                        Use synchronous filesystem calls for the resolver.
  --resolve-loader-alias-alias string[]                       Ignore request (replace with empty module). New request.
  --resolve-loader-alias-name string[]                        Request to be redirected.
  --resolve-loader-alias-only-module                          Redirect only exact matching request.
  --resolve-loader-alias-reset                                Clear all items provided in configuration. Redirect module requests.
  --resolve-loader-alias-fields string[]                      Field in the description file (usually package.json) which are used to
                                                              redirect requests inside the module.
  --resolve-loader-alias-fields-reset                         Clear all items provided in configuration. Fields in the description file
                                                              (usually package.json) which are used to redirect requests inside the module.
  --resolve-loader-cache                                      Enable caching of successfully resolved requests (cache entries are
                                                              revalidated).
  --resolve-loader-cache-with-context                         Include the context information in the cache identifier when caching.
  --resolve-loader-condition-names string[]                   Condition names for exports field entry point.
  --resolve-loader-condition-names-reset                      Clear all items provided in configuration. Condition names for exports field
                                                              entry point.
  --resolve-loader-description-files string[]                 Filename used to find a description file (like a package.json).
  --resolve-loader-description-files-reset                    Clear all items provided in configuration. Filenames used to find a
                                                              description file (like a package.json).
  --resolve-loader-enforce-extension                          Enforce the resolver to use one of the extensions from the extensions option
                                                              (User must specify requests without extension).
  --resolve-loader-exports-fields string[]                    Field name from the description file (usually package.json) which is used to
                                                              provide entry points of a package.
  --resolve-loader-exports-fields-reset                       Clear all items provided in configuration. Field names from the description
                                                              file (usually package.json) which are used to provide entry points of a
                                                              package.
  --resolve-loader-extensions string[]                        Extension added to the request when trying to find the file.
  --resolve-loader-extensions-reset                           Clear all items provided in configuration. Extensions added to the request
                                                              when trying to find the file.
  --resolve-loader-fully-specified                            Treats the request specified by the user as fully specified, meaning no
                                                              extensions are added and the mainFiles in directories are not resolved (This
                                                              doesn't affect requests from mainFields, aliasFields or aliases).
  --resolve-loader-main-fields string[]                       Field name from the description file (package.json) which are used to find
                                                              the default entry point.
  --resolve-loader-main-fields-reset                          Clear all items provided in configuration. Field names from the description
                                                              file (package.json) which are used to find the default entry point.
  --resolve-loader-main-files string[]                        Filename used to find the default entry point if there is no description file
                                                              or main field.
  --resolve-loader-main-files-reset                           Clear all items provided in configuration. Filenames used to find the default
                                                              entry point if there is no description file or main field.
  --resolve-loader-modules string[]                           Folder name or directory path where to find modules.
  --resolve-loader-modules-reset                              Clear all items provided in configuration. Folder names or directory paths
                                                              where to find modules.
  --resolve-loader-restrictions string[]                      Resolve restriction. Resolve result must fulfill this restriction.
  --resolve-loader-restrictions-reset                         Clear all items provided in configuration. A list of resolve restrictions.
                                                              Resolve results must fulfill all of these restrictions to resolve
                                                              successfully. Other resolve paths are taken when restrictions are not met.
  --resolve-loader-roots string[]                             Directory in which requests that are server-relative URLs (starting with '/')
                                                              are resolved.
  --resolve-loader-roots-reset                                Clear all items provided in configuration. A list of directories in which
                                                              requests that are server-relative URLs (starting with '/') are resolved. On
                                                              non-windows system these requests are tried to resolve as absolute path
                                                              first.
  --resolve-loader-symlinks                                   Enable resolving symlinks to the original location.
  --resolve-loader-unsafe-cache                               Enable caching of successfully resolved requests (cache entries are not
                                                              revalidated).
  --resolve-loader-use-sync-file-system-calls                 Use synchronous filesystem calls for the resolver.
  --stats-all                                                 Fallback value for stats options when an option is not defined (has
                                                              precedence over local webpack defaults).
  --snapshot-build-dependencies-hash                          Use hashes of the content of the files/directories to determine invalidation.
  --snapshot-build-dependencies-timestamp                     Use timestamps of the files/directories to determine invalidation.
  --snapshot-immutable-paths string[]                         A path to a immutable directory (usually a package manager cache directory).
  --snapshot-immutable-paths-reset                            Clear all items provided in configuration. List of paths that are managed by
                                                              a package manager and contain a version or hash in its path so all files are
                                                              immutable.
  --snapshot-managed-paths string[]                           A path to a managed directory (usually a node_modules directory).
  --snapshot-managed-paths-reset                              Clear all items provided in configuration. List of paths that are managed by
                                                              a package manager and can be trusted to not be modified otherwise.
  --snapshot-module-hash                                      Use hashes of the content of the files/directories to determine invalidation.
  --snapshot-module-timestamp                                 Use timestamps of the files/directories to determine invalidation.
  --snapshot-resolve-hash                                     Use hashes of the content of the files/directories to determine invalidation.
  --snapshot-resolve-timestamp                                Use timestamps of the files/directories to determine invalidation.
  --snapshot-resolve-build-dependencies-hash                  Use hashes of the content of the files/directories to determine invalidation.
  --snapshot-resolve-build-dependencies-timestamp             Use timestamps of the files/directories to determine invalidation.
  --stats-all                                                 Fallback value for stats options when an option is not defined (has
                                                              precedence over local webpack defaults).
  --stats-assets                                              Add assets information.
  --stats-assets-sort string                                  Sort the assets by that field.
  --stats-assets-space number                                 Space to display assets (groups will be collapsed to fit this space).
  --stats-built-at                                            Add built at time information.
  --stats-cached                                              Add information about cached (not built) modules.
  --stats-cached-assets                                       Show cached assets (setting this to `false` only shows emitted files).
  --stats-cached-modules                                      Add information about cached (not built) modules.
  --stats-children                                            Add children information.
  --stats-chunk-group-auxiliary                               Display auxiliary assets in chunk groups.
  --stats-chunk-group-children                                Display children of chunk groups.
  --stats-chunk-group-max-assets number                       Limit of assets displayed in chunk groups.
  --stats-chunk-groups                                        Display all chunk groups with the corresponding bundles.
  --stats-chunk-modules                                       Add built modules information to chunk information.
  --stats-chunk-origins                                       Add the origins of chunks and chunk merging info.
  --stats-chunk-relations                                     Add information about parent, children and sibling chunks to chunk
                                                              information.
  --stats-chunks                                              Add chunk information.
  --stats-chunks-sort string                                  Sort the chunks by that field.
  --stats-colors                                              Enables/Disables colorful output.
  --stats-colors-bold string                                  Custom color for bold text.
  --stats-colors-cyan string                                  Custom color for cyan text.
  --stats-colors-green string                                 Custom color for green text.
  --stats-colors-magenta string                               Custom color for magenta text.
  --stats-colors-red string                                   Custom color for red text.
  --stats-colors-yellow string                                Custom color for yellow text.
  --stats-context string                                      Context directory for request shortening.
  --stats-dependent-modules                                   Show chunk modules that are dependencies of other modules of the chunk.
  --stats-depth                                               Add module depth in module graph.
  --stats-entrypoints string                                  Display the entry points with the corresponding bundles.
  --stats-env                                                 Add --env information.
  --stats-error-details                                       Add details to errors (like resolving log).
  --stats-error-stack                                         Add internal stack trace to errors.
  --stats-errors                                              Add errors.
  --stats-errors-count                                        Add errors count.
  --stats-exclude-assets string[]                             Suppress assets that match the specified filters. Filters can be Strings,
                                                              RegExps or Functions.
  --stats-exclude-assets-reset                                Clear all items provided in configuration. Suppress assets that match the
                                                              specified filters. Filters can be Strings, RegExps or Functions.
  --stats-exclude-modules string[]                            Suppress modules that match the specified filters. Filters can be Strings,
                                                              RegExps, Booleans or Functions.
  --stats-exclude-modules-reset                               Clear all items provided in configuration. Suppress modules that match the
                                                              specified filters. Filters can be Strings, RegExps, Booleans or Functions.
  --stats-group-assets-by-chunk                               Group assets by how their are related to chunks.
  --stats-group-assets-by-emit-status                         Group assets by their status (emitted, compared for emit or cached).
  --stats-group-assets-by-extension                           Group assets by their extension.
  --stats-group-assets-by-info                                Group assets by their asset info (immutable, development,
                                                              hotModuleReplacement, etc).
  --stats-group-assets-by-path                                Group assets by their path.
  --stats-group-modules-by-attributes                         Group modules by their attributes (errors, warnings, assets, optional,
                                                              orphan, or dependent).
  --stats-group-modules-by-cache-status                       Group modules by their status (cached or built and cacheable).
  --stats-group-modules-by-extension                          Group modules by their extension.
  --stats-group-modules-by-path                               Group modules by their path.
  --stats-hash                                                Add the hash of the compilation.
  --stats-ids                                                 Add ids.
  --stats-logging string                                      Specify log level of logging output. Enable/disable logging output (`true`:
                                                              shows normal logging output, loglevel: log).
  --stats-logging-debug string[]                              Enable/Disable debug logging for all loggers. Include debug logging of
                                                              specified loggers (i. e. for plugins or loaders). Filters can be Strings,
                                                              RegExps or Functions.
  --stats-logging-debug-reset                                 Clear all items provided in configuration. Include debug logging of specified
                                                              loggers (i. e. for plugins or loaders). Filters can be Strings, RegExps or
                                                              Functions.
  --stats-logging-trace                                       Add stack traces to logging output.
  --stats-module-assets                                       Add information about assets inside modules.
  --stats-module-trace                                        Add dependencies and origin of warnings/errors.
  --stats-modules                                             Add built modules information.
  --stats-modules-sort string                                 Sort the modules by that field.
  --stats-modules-space number                                Space to display modules (groups will be collapsed to fit this space, values
                                                              is in number of modules/groups).
  --stats-nested-modules                                      Add information about modules nested in other modules (like with module
                                                              concatenation).
  --stats-optimization-bailout                                Show reasons why optimization bailed out for modules.
  --stats-orphan-modules                                      Add information about orphan modules.
  --stats-output-path                                         Add output path information.
  --stats-performance                                         Add performance hint flags.
  --stats-preset string                                       Preset for the default values.
  --stats-provided-exports                                    Show exports provided by modules.
  --stats-public-path                                         Add public path information.
  --stats-reasons                                             Add information about the reasons why modules are included.
  --stats-related-assets                                      Add information about assets that are related to other assets (like
                                                              SourceMaps for assets).
  --stats-runtime-modules                                     Add information about runtime modules.
  --stats-timings                                             Add timing information.
  --stats-source                                              Add the source code of modules.
  --stats-version                                             Add webpack version information.
  --stats-used-exports                                        Show exports used by modules.
  --stats-warnings-count                                      Add warnings count.
  --stats-warnings                                            Add warnings.
  --stats-warnings-filter string[]                            Suppress listing warnings that match the specified filters (they will still
                                                              be counted). Filters can be Strings, RegExps or Functions.
  --stats-warnings-filter-reset                               Clear all items provided in configuration. Suppress listing warnings that
                                                              match the specified filters (they will still be counted). Filters can be
                                                              Strings, RegExps or Functions.
  --watch-options-aggregate-timeout number                    Delay the rebuilt after the first change. Value is a time in ms.
  --watch-options-ignored string[]                            A glob pattern for files that should be ignored from watching.
  --watch-options-ignored-reset                               Clear all items provided in configuration. Ignore some files from watching
                                                              (glob pattern).
  --watch-options-poll string                                 `number`: use polling with specified interval. `true`: use polling.
  --watch-options-stdin                                       Stop watching when stdin stream has ended.
  --no-hot                                                    Negates hot
  --no-stats                                                  Negates stats
  --no-amd                                                    Negates amd
  --no-bail                                                   Negates bail
  --no-cache                                                  Negates cache
  --no-experiments-asset                                      Negates experiments-asset
  --no-experiments-async-web-assembly                         Negates experiments-async-web-assembly
  --no-experiments-import-async                               Negates experiments-import-async
  --no-experiments-import-await                               Negates experiments-import-await
  --no-experiments-mjs                                        Negates experiments-mjs
  --no-experiments-output-module                              Negates experiments-output-module
  --no-experiments-sync-web-assembly                          Negates experiments-sync-web-assembly
  --no-experiments-top-level-await                            Negates experiments-top-level-await
  --no-externals-presets-electron                             Negates externals-presets-electron
  --no-externals-presets-electron-main                        Negates externals-presets-electron-main
  --no-externals-presets-electron-preload                     Negates externals-presets-electron-preload
  --no-externals-presets-electron-renderer                    Negates externals-presets-electron-renderer
  --no-externals-presets-node                                 Negates externals-presets-node
  --no-externals-presets-nwjs                                 Negates externals-presets-nwjs
  --no-externals-presets-web                                  Negates externals-presets-web
  --no-externals-presets-web-async                            Negates externals-presets-web-async
  --no-module-expr-context-critical                           Negates module-expr-context-critical
  --no-module-expr-context-recursive                          Negates module-expr-context-recursive
  --no-module-rules-side-effects                              Negates module-rules-side-effects
  --no-module-strict-export-presence                          Negates module-strict-export-presence
  --no-module-strict-this-context-on-imports                  Negates module-strict-this-context-on-imports
  --no-module-unknown-context-critical                        Negates module-unknown-context-critical
  --no-module-unknown-context-recursive                       Negates module-unknown-context-recursive
  --no-module-unsafe-cache                                    Negates module-unsafe-cache
  --no-module-wrapped-context-critical                        Negates module-wrapped-context-critical
  --no-module-wrapped-context-recursive                       Negates module-wrapped-context-recursive
  --no-node                                                   Negates node
  --no-node-global                                            Negates node-global
  --no-optimization-check-wasm-types                          Negates optimization-check-wasm-types
  --no-optimization-concatenate-modules                       Negates optimization-concatenate-modules
  --no-optimization-emit-on-errors                            Negates optimization-emit-on-errors
  --no-optimization-flag-included-chunks                      Negates optimization-flag-included-chunks
  --no-optimization-inner-graph                               Negates optimization-inner-graph
  --no-optimization-mangle-exports                            Negates optimization-mangle-exports
  --no-optimization-mangle-wasm-imports                       Negates optimization-mangle-wasm-imports
  --no-optimization-merge-duplicate-chunks                    Negates optimization-merge-duplicate-chunks
  --no-optimization-minimize                                  Negates optimization-minimize
  --no-optimization-portable-records                          Negates optimization-portable-records
  --no-optimization-provided-exports                          Negates optimization-provided-exports
  --no-optimization-remove-available-modules                  Negates optimization-remove-available-modules
  --no-optimization-remove-empty-chunks                       Negates optimization-remove-empty-chunks
  --no-optimization-side-effects                              Negates optimization-side-effects
  --no-optimization-split-chunks                              Negates optimization-split-chunks
  --no-optimization-split-chunks-hide-path-info               Negates optimization-split-chunks-hide-path-info
  --no-optimization-used-exports                              Negates optimization-used-exports
  --no-output-charset                                         Negates output-charset
  --no-output-compare-before-emit                             Negates output-compare-before-emit
  --no-output-environment-arrow-function                      Negates output-environment-arrow-function
  --no-output-environment-big-int-literal                     Negates output-environment-big-int-literal
  --no-output-environment-const                               Negates output-environment-const
  --no-output-environment-destructuring                       Negates output-environment-destructuring
  --no-output-environment-dynamic-import                      Negates output-environment-dynamic-import
  --no-output-environment-for-of                              Negates output-environment-for-of
  --no-output-environment-module                              Negates output-environment-module
  --no-output-iife                                            Negates output-iife
  --no-output-library-umd-named-define                        Negates output-library-umd-named-define
  --no-output-module                                          Negates output-module
  --no-output-pathinfo                                        Negates output-pathinfo
  --no-output-strict-module-exception-handling                Negates output-strict-module-exception-handling
  --no-performance                                            Negates performance
  --no-profile                                                Negates profile
  --no-resolve-alias-only-module                              Negates resolve-alias-only-module
  --no-resolve-cache                                          Negates resolve-cache
  --no-resolve-cache-with-context                             Negates resolve-cache-with-context
  --no-resolve-symlinks                                       Negates resolve-symlinks
  --no-resolve-unsafe-cache                                   Negates resolve-unsafe-cache
  --no-resolve-use-sync-file-system-calls                     Negates resolve-use-sync-file-system-calls
  --no-resolve-loader-alias-only-module                       Negates resolve-loader-alias-only-module
  --no-resolve-loader-cache                                   Negates resolve-loader-cache
  --no-resolve-loader-cache-with-context                      Negates resolve-loader-cache-with-context
  --no-resolve-loader-symlinks                                Negates resolve-loader-symlinks
  --no-resolve-loader-unsafe-cache                            Negates resolve-loader-unsafe-cache
  --no-resolve-loader-use-sync-file-system-calls              Negates resolve-loader-use-sync-file-system-calls
  --no-snapshot-build-dependencies-hash                       Negates snapshot-build-dependencies-hash
  --no-snapshot-build-dependencies-timestamp                  Negates snapshot-build-dependencies-timestamp
  --no-snapshot-module-hash                                   Negates snapshot-module-hash
  --no-snapshot-module-timestamp                              Negates snapshot-module-timestamp
  --no-snapshot-resolve-hash                                  Negates snapshot-resolve-hash
  --no-snapshot-resolve-timestamp                             Negates snapshot-resolve-timestamp
  --no-snapshot-resolve-build-dependencies-hash               Negates snapshot-resolve-build-dependencies-hash
  --no-snapshot-resolve-build-dependencies-timestamp          Negates snapshot-resolve-build-dependencies-timestamp
  --no-stats-all                                              Negates stats-all
  --no-stats-assets                                           Negates stats-assets
  --no-stats-built-at                                         Negates stats-built-at
  --no-stats-cached                                           Negates stats-cached
  --no-stats-cached-assets                                    Negates stats-cached-assets
  --no-stats-cached-modules                                   Negates stats-cached-modules
  --no-stats-children                                         Negates stats-children
  --no-stats-chunk-group-auxiliary                            Negates stats-chunk-group-auxiliary
  --no-stats-chunk-group-children                             Negates stats-chunk-group-children
  --no-stats-chunk-groups                                     Negates stats-chunk-groups
  --no-stats-chunk-modules                                    Negates stats-chunk-modules
  --no-stats-chunk-origins                                    Negates stats-chunk-origins
  --no-stats-chunk-relations                                  Negates stats-chunk-relations
  --no-stats-chunks                                           Negates stats-chunks
  --no-stats-colors                                           Negates stats-colors
  --no-stats-dependent-modules                                Negates stats-dependent-modules
  --no-stats-depth                                            Negates stats-depth
  --no-stats-env                                              Negates stats-env
  --no-stats-error-details                                    Negates stats-error-details
  --no-stats-error-stack                                      Negates stats-error-stack
  --no-stats-errors                                           Negates stats-errors
  --no-stats-errors-count                                     Negates stats-errors-count
  --no-stats-group-assets-by-chunk                            Negates stats-group-assets-by-chunk
  --no-stats-group-assets-by-emit-status                      Negates stats-group-assets-by-emit-status
  --no-stats-group-assets-by-extension                        Negates stats-group-assets-by-extension
  --no-stats-group-assets-by-info                             Negates stats-group-assets-by-info
  --no-stats-group-assets-by-path                             Negates stats-group-assets-by-path
  --no-stats-group-modules-by-attributes                      Negates stats-group-modules-by-attributes
  --no-stats-group-modules-by-cache-status                    Negates stats-group-modules-by-cache-status
  --no-stats-group-modules-by-extension                       Negates stats-group-modules-by-extension
  --no-stats-group-modules-by-path                            Negates stats-group-modules-by-path
  --no-stats-hash                                             Negates stats-hash
  --no-stats-ids                                              Negates stats-ids
  --no-stats-logging-trace                                    Negates stats-logging-trace
  --no-stats-module-assets                                    Negates stats-module-assets
  --no-stats-module-trace                                     Negates stats-module-trace
  --no-stats-modules                                          Negates stats-modules
  --no-stats-nested-modules                                   Negates stats-nested-modules
  --no-stats-optimization-bailout                             Negates stats-optimization-bailout
  --no-stats-orphan-modules                                   Negates stats-orphan-modules
  --no-stats-output-path                                      Negates stats-output-path
  --no-stats-performance                                      Negates stats-performance
  --no-stats-provided-exports                                 Negates stats-provided-exports
  --no-stats-public-path                                      Negates stats-public-path
  --no-stats-reasons                                          Negates stats-reasons
  --no-stats-related-assets                                   Negates stats-related-assets
  --no-stats-runtime-modules                                  Negates stats-runtime-modules
  --no-stats-source                                           Negates stats-source
  --no-stats-timings                                          Negates stats-timings
  --no-stats-used-exports                                     Negates stats-used-exports
  --no-stats-version                                          Negates stats-version
  --no-stats-warnings                                         Negates stats-warnings
  --no-stats-warnings-count                                   Negates stats-warnings-count
  --no-watch-options-stdin                                    Negates watch-options-stdin
```
