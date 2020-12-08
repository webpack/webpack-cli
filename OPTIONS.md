````
          ⬡                     webpack                     ⬡

         https://webpack.js.org

The build tool for modern web applications

Usage: `webpack [...options] | <command>`
Example: `webpack help --flag | <command>`

Commands

  init | c      Initialize a new webpack configuration
  migrate | m   Migrate a configuration to a new version
  loader | l    Scaffold a loader repository
  plugin | p    Scaffold a plugin repository
  info | i      Outputs information about your system and dependencies
  serve | s     Run the webpack Dev Server

Options

Option      : --config
Type        : string[]
Description : Provide path to a webpack configuration file e.g. ./webpack.config.js

Option      : --config-name
Type        : string[]
Description : Name of the configuration to use

Option      : --merge
Type        : boolean
Description : Merge two or more configurations using webpack-merge

Option      : --env
Type        : string
Description : Environment passed to the configuration when it is a function

Option      : --hot
Type        : boolean
Description : Enables Hot Module Replacement

Option      : --analyze
Type        : boolean
Description : It invokes webpack-bundle-analyzer plugin to get bundle information

Option      : --progress
Type        : boolean, string
Description : Print compilation progress during build

Option      : --prefetch
Type        : string
Description : Prefetch this request

Option      : --help
Type        : boolean, string
Description : Outputs list of supported flags

Option      : --version
Type        : boolean
Description : Get current version

Option      : --json
Type        : string, boolean
Description : Prints result as JSON or store it in a file

Option      : --color
Type        : boolean
Description : Enable colors on console

Option      : --amd
Type        : boolean
Description : You can pass `false` to disable AMD support.

Option      : --bail
Type        : boolean
Description : Report the first error as a hard error instead of tolerating it.

Option      : --cache
Type        : boolean
Description : Enable in memory caching. Disable caching.

Option      : --cache-type
Type        : string
Description : In memory caching. Filesystem caching.

Option      : --cache-cache-directory
Type        : string
Description : Base directory for the cache (defaults to node_modules/.cache/webpack).

Option      : --cache-cache-location
Type        : string
Description : Locations for the cache (defaults to cacheDirectory / name).

Option      : --cache-hash-algorithm
Type        : string
Description : Algorithm used for generation the hash (see node.js crypto package).

Option      : --cache-idle-timeout
Type        : number
Description : Time in ms after which idle period the cache storing should happen (only for store: 'pack' or 'idle').

Option      : --cache-idle-timeout-for-initial-store
Type        : number
Description : Time in ms after which idle period the initial cache storing should happen (only for store: 'pack' or 'idle').

Option      : --cache-immutable-paths
Type        : string[]
Description : A path to a immutable directory (usually a package manager cache directory).

Option      : --cache-immutable-paths-reset
Type        : boolean
Description : Clear all items provided in configuration. List of paths that are managed by a package manager and contain a version or hash in its path so all files are immutable.

Option      : --cache-managed-paths
Type        : string[]
Description : A path to a managed directory (usually a node_modules directory).

Option      : --cache-managed-paths-reset
Type        : boolean
Description : Clear all items provided in configuration. List of paths that are managed by a package manager and can be trusted to not be modified otherwise.

Option      : --cache-name
Type        : string
Description : Name for the cache. Different names will lead to different coexisting caches.

Option      : --cache-store
Type        : string
Description : When to store data to the filesystem. (pack: Store data when compiler is idle in a single file).

Option      : --cache-version
Type        : string
Description : Version of the cache data. Different versions won't allow to reuse the cache and override existing content. Update the version when config changed in a way which doesn't allow to reuse cache. This will invalidate the cache.

Option      : --context
Type        : string
Description : The base directory (absolute path!) for resolving the `entry` option. If `output.pathinfo` is set, the included pathinfo is shortened to this directory.

Option      : --dependencies
Type        : string[]
Description : References to another configuration to depend on.

Option      : --dependencies-reset
Type        : boolean
Description : Clear all items provided in configuration. References to other configurations to depend on.

Option      : --devtool
Type        : string
Description : Determine source maps to use

Option      : --entry
Type        : string[]
Description : The entry point(s) of your application e.g. ./src/main.js

Option      : --entry-reset
Type        : boolean
Description : Clear all items provided in configuration. All modules are loaded upon startup. The last one is exported.

Option      : --experiments-asset
Type        : boolean
Description : Allow module type 'asset' to generate assets.

Option      : --experiments-async-web-assembly
Type        : boolean
Description : Support WebAssembly as asynchronous EcmaScript Module.

Option      : --experiments-output-module
Type        : boolean
Description : Allow output javascript files as module source type.

Option      : --experiments-sync-web-assembly
Type        : boolean
Description : Support WebAssembly as synchronous EcmaScript Module (outdated).

Option      : --experiments-top-level-await
Type        : boolean
Description : Allow using top-level-await in EcmaScript Modules.

Option      : --externals
Type        : string[]
Description : Every matched dependency becomes external. An exact matched dependency becomes external. The same string is used as external dependency.

Option      : --externals-reset
Type        : boolean
Description : Clear all items provided in configuration. Specify dependencies that shouldn't be resolved by webpack, but should become dependencies of the resulting bundle. The kind of the dependency depends on `output.libraryTarget`.

Option      : --externals-presets-electron
Type        : boolean
Description : Treat common electron built-in modules in main and preload context like 'electron', 'ipc' or 'shell' as external and load them via require() when used.

Option      : --externals-presets-electron-main
Type        : boolean
Description : Treat electron built-in modules in the main context like 'app', 'ipc-main' or 'shell' as external and load them via require() when used.

Option      : --externals-presets-electron-preload
Type        : boolean
Description : Treat electron built-in modules in the preload context like 'web-frame', 'ipc-renderer' or 'shell' as external and load them via require() when used.

Option      : --externals-presets-electron-renderer
Type        : boolean
Description : Treat electron built-in modules in the renderer context like 'web-frame', 'ipc-renderer' or 'shell' as external and load them via require() when used.

Option      : --externals-presets-node
Type        : boolean
Description : Treat node.js built-in modules like fs, path or vm as external and load them via require() when used.

Option      : --externals-presets-nwjs
Type        : boolean
Description : Treat NW.js legacy nw.gui module as external and load it via require() when used.

Option      : --externals-presets-web
Type        : boolean
Description : Treat references to 'http(s)://...' and 'std:...' as external and load them via import when used (Note that this changes execution order as externals are executed before any other code in the chunk).

Option      : --externals-presets-web-async
Type        : boolean
Description : Treat references to 'http(s)://...' and 'std:...' as external and load them via async import() when used (Note that this external type is an async module, which has various effects on the execution).

Option      : --externals-type
Type        : string
Description : Specifies the default type of externals ('amd*', 'umd*', 'system' and 'jsonp' depend on output.libraryTarget set to the same value).

Option      : --ignore-warnings
Type        : string[]
Description : A RegExp to select the warning message.

Option      : --ignore-warnings-file
Type        : string[]
Description : A RegExp to select the origin file for the warning.

Option      : --ignore-warnings-message
Type        : string[]
Description : A RegExp to select the warning message.

Option      : --ignore-warnings-module
Type        : string[]
Description : A RegExp to select the origin module for the warning.

Option      : --ignore-warnings-reset
Type        : boolean
Description : Clear all items provided in configuration. Ignore specific warnings.

Option      : --infrastructure-logging-debug
Type        : string[]
Description : Enable/Disable debug logging for all loggers. Enable debug logging for specific loggers.

Option      : --infrastructure-logging-debug-reset
Type        : boolean
Description : Clear all items provided in configuration. Enable debug logging for specific loggers.

Option      : --infrastructure-logging-level
Type        : string
Description : Log level.

Option      : --mode
Type        : string
Description : Defines the mode to pass to webpack

Option      : --module-expr-context-critical
Type        : boolean
Description : Enable warnings for full dynamic dependencies.

Option      : --module-expr-context-recursive
Type        : boolean
Description : Enable recursive directory lookup for full dynamic dependencies.

Option      : --module-expr-context-reg-exp
Type        : string
Description : Sets the default regular expression for full dynamic dependencies.

Option      : --module-expr-context-request
Type        : string
Description : Set the default request for full dynamic dependencies.

Option      : --module-no-parse
Type        : string[]
Description : A regular expression, when matched the module is not parsed. An absolute path, when the module starts with this path it is not parsed.

Option      : --module-no-parse-reset
Type        : boolean
Description : Clear all items provided in configuration. Don't parse files matching. It's matched against the full resolved request.

Option      : --module-rules-compiler
Type        : string[]
Description : Match the child compiler name.

Option      : --module-rules-dependency
Type        : string[]
Description : Match dependency type.

Option      : --module-rules-enforce
Type        : string[]
Description : Enforce this rule as pre or post step.

Option      : --module-rules-exclude
Type        : string[]
Description : Shortcut for resource.exclude.

Option      : --module-rules-include
Type        : string[]
Description : Shortcut for resource.include.

Option      : --module-rules-issuer
Type        : string[]
Description : Match the issuer of the module (The module pointing to this module).

Option      : --module-rules-loader
Type        : string[]
Description : A loader request.

Option      : --module-rules-mimetype
Type        : string[]
Description : Match module mimetype when load from Data URI.

Option      : --module-rules-real-resource
Type        : string[]
Description : Match the real resource path of the module.

Option      : --module-rules-resource
Type        : string[]
Description : Match the resource path of the module.

Option      : --module-rules-resource-fragment
Type        : string[]
Description : Match the resource fragment of the module.

Option      : --module-rules-resource-query
Type        : string[]
Description : Match the resource query of the module.

Option      : --module-rules-side-effects
Type        : boolean[]
Description : Flags a module as with or without side effects.

Option      : --module-rules-test
Type        : string[]
Description : Shortcut for resource.test.

Option      : --module-rules-type
Type        : string[]
Description : Module type to use for the module.

Option      : --module-rules-use-ident
Type        : string[]
Description : Unique loader options identifier.

Option      : --module-rules-use-loader
Type        : string[]
Description : A loader request.

Option      : --module-rules-use-options
Type        : string[]
Description : Options passed to a loader.

Option      : --module-rules-use
Type        : string[]
Description : A loader request.

Option      : --module-rules-reset
Type        : boolean
Description : Clear all items provided in configuration. A list of rules.

Option      : --module-strict-export-presence
Type        : boolean
Description : Emit errors instead of warnings when imported names don't exist in imported module.

Option      : --module-strict-this-context-on-imports
Type        : boolean
Description : Handle the this context correctly according to the spec for namespace objects.

Option      : --module-unknown-context-critical
Type        : boolean
Description : Enable warnings when using the require function in a not statically analyse-able way.

Option      : --module-unknown-context-recursive
Type        : boolean
Description : Enable recursive directory lookup when using the require function in a not statically analyse-able way.

Option      : --module-unknown-context-reg-exp
Type        : string
Description : Sets the regular expression when using the require function in a not statically analyse-able way.

Option      : --module-unknown-context-request
Type        : string
Description : Sets the request when using the require function in a not statically analyse-able way.

Option      : --module-unsafe-cache
Type        : boolean
Description : Cache the resolving of module requests.

Option      : --module-wrapped-context-critical
Type        : boolean
Description : Enable warnings for partial dynamic dependencies.

Option      : --module-wrapped-context-recursive
Type        : boolean
Description : Enable recursive directory lookup for partial dynamic dependencies.

Option      : --module-wrapped-context-reg-exp
Type        : string
Description : Set the inner regular expression for partial dynamic dependencies.

Option      : --name
Type        : string
Description : Name of the configuration. Used when loading multiple configurations.

Option      : --node
Type        : boolean
Description : Include polyfills or mocks for various node stuff.

Option      : --node-dirname
Type        : string
Description : Include a polyfill for the '__dirname' variable.

Option      : --node-filename
Type        : string
Description : Include a polyfill for the '__filename' variable.

Option      : --node-global
Type        : boolean
Description : Include a polyfill for the 'global' variable.

Option      : --optimization-check-wasm-types
Type        : boolean
Description : Check for incompatible wasm types when importing/exporting from/to ESM.

Option      : --optimization-chunk-ids
Type        : string
Description : Define the algorithm to choose chunk ids (named: readable ids for better debugging, deterministic: numeric hash ids for better long term caching, size: numeric ids focused on minimal initial download size, total-size: numeric ids focused on minimal total download size, false: no algorithm used, as custom one can be provided via plugin).

Option      : --optimization-concatenate-modules
Type        : boolean
Description : Concatenate modules when possible to generate less modules, more efficient code and enable more optimizations by the minimizer.

Option      : --optimization-emit-on-errors
Type        : boolean
Description : Emit assets even when errors occur. Critical errors are emitted into the generated code and will cause errors at runtime.

Option      : --optimization-flag-included-chunks
Type        : boolean
Description : Also flag chunks as loaded which contain a subset of the modules.

Option      : --optimization-inner-graph
Type        : boolean
Description : Creates a module-internal dependency graph for top level symbols, exports and imports, to improve unused exports detection.

Option      : --optimization-mangle-exports
Type        : string
Description : Rename exports when possible to generate shorter code (depends on optimization.usedExports and optimization.providedExports, true/"deterministic": generate short deterministic names optimized for caching, "size": generate the shortest possible names).

Option      : --optimization-mangle-wasm-imports
Type        : boolean
Description : Reduce size of WASM by changing imports to shorter strings.

Option      : --optimization-merge-duplicate-chunks
Type        : boolean
Description : Merge chunks which contain the same modules.

Option      : --optimization-minimize
Type        : boolean
Description : Enable minimizing the output. Uses optimization.minimizer.

Option      : --optimization-module-ids
Type        : string
Description : Define the algorithm to choose module ids (natural: numeric ids in order of usage, named: readable ids for better debugging, hashed: (deprecated) short hashes as ids for better long term caching, deterministic: numeric hash ids for better long term caching, size: numeric ids focused on minimal initial download size, false: no algorithm used, as custom one can be provided via plugin).

Option      : --optimization-node-env
Type        : string
Description : Set process.env.NODE_ENV to a specific value.

Option      : --optimization-portable-records
Type        : boolean
Description : Generate records with relative paths to be able to move the context folder.

Option      : --optimization-provided-exports
Type        : boolean
Description : Figure out which exports are provided by modules to generate more efficient code.

Option      : --optimization-real-content-hash
Type        : boolean
Description : Use real [contenthash] based on final content of the assets.

Option      : --optimization-remove-available-modules
Type        : boolean
Description : Removes modules from chunks when these modules are already included in all parents.

Option      : --optimization-remove-empty-chunks
Type        : boolean
Description : Remove chunks which are empty.

Option      : --optimization-runtime-chunk
Type        : string
Description : Create an additional chunk which contains only the webpack runtime and chunk hash maps.

Option      : --optimization-runtime-chunk-name
Type        : string
Description : The name or name factory for the runtime chunks.

Option      : --optimization-side-effects
Type        : string
Description : Skip over modules which contain no side effects when exports are not used (false: disabled, 'flag': only use manually placed side effects flag, true: also analyse source code for side effects).

Option      : --optimization-split-chunks
Type        : boolean
Description : Optimize duplication and caching by splitting chunks by shared modules and cache group.

Option      : --optimization-split-chunks-automatic-name-delimiter
Type        : string
Description : Sets the name delimiter for created chunks.

Option      : --optimization-split-chunks-chunks
Type        : string
Description : Select chunks for determining shared modules (defaults to "async", "initial" and "all" requires adding these chunks to the HTML).

Option      : --optimization-split-chunks-default-size-types
Type        : string[]
Description : Size type, like 'javascript', 'webassembly'.

Option      : --optimization-split-chunks-default-size-types-reset
Type        : boolean
Description : Clear all items provided in configuration. Sets the size types which are used when a number is used for sizes.

Option      : --optimization-split-chunks-enforce-size-threshold
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-fallback-cache-group-automatic-name-delimiter
Type        : string
Description : Sets the name delimiter for created chunks.

Option      : --optimization-split-chunks-fallback-cache-group-max-async-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-fallback-cache-group-max-initial-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-fallback-cache-group-max-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-fallback-cache-group-min-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-filename
Type        : string
Description : Sets the template for the filename for created chunks.

Option      : --optimization-split-chunks-hide-path-info
Type        : boolean
Description : Prevents exposing path info when creating names for parts splitted by maxSize.

Option      : --optimization-split-chunks-max-async-requests
Type        : number
Description : Maximum number of requests which are accepted for on-demand loading.

Option      : --optimization-split-chunks-max-async-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-max-initial-requests
Type        : number
Description : Maximum number of initial chunks which are accepted for an entry point.

Option      : --optimization-split-chunks-max-initial-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-max-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-min-chunks
Type        : number
Description : Minimum number of times a module has to be duplicated until it's considered for splitting.

Option      : --optimization-split-chunks-min-remaining-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-min-size
Type        : number
Description : Size of the javascript part of the chunk.

Option      : --optimization-split-chunks-name
Type        : string
Description : Give chunks created a name (chunks with equal name are merged).

Option      : --optimization-split-chunks-used-exports
Type        : boolean
Description : Compare used exports when checking common modules. Modules will only be put in the same chunk when exports are equal.

Option      : --optimization-used-exports
Type        : string
Description : Figure out which exports are used by modules to mangle export names, omit unused exports and generate more efficient code (true: analyse used exports for each runtime, "global": analyse exports globally for all runtimes combined).

Option      : --output-asset-module-filename
Type        : string
Description : The filename of asset modules as relative path inside the `output.path` directory.

Option      : --output-charset
Type        : boolean
Description : Add charset attribute for script tag.

Option      : --output-chunk-filename
Type        : string
Description : The filename of non-initial chunks as relative path inside the `output.path` directory.

Option      : --output-chunk-format
Type        : string
Description : The format of chunks (formats included by default are 'array-push' (web/WebWorker), 'commonjs' (node.js), but others might be added by plugins).

Option      : --output-chunk-load-timeout
Type        : number
Description : Number of milliseconds before chunk request expires.

Option      : --output-chunk-loading
Type        : string
Description : The method of loading chunks (methods included by default are 'jsonp' (web), 'importScripts' (WebWorker), 'require' (sync node.js), 'async-node' (async node.js), but others might be added by plugins).

Option      : --output-chunk-loading-global
Type        : string
Description : The global variable used by webpack for loading of chunks.

Option      : --output-compare-before-emit
Type        : boolean
Description : Check if to be emitted file already exists and have the same content before writing to output filesystem.

Option      : --output-cross-origin-loading
Type        : string
Description : This option enables cross-origin loading of chunks.

Option      : --output-devtool-fallback-module-filename-template
Type        : string
Description : Similar to `output.devtoolModuleFilenameTemplate`, but used in the case of duplicate module identifiers.

Option      : --output-devtool-module-filename-template
Type        : string
Description : Filename template string of function for the sources array in a generated SourceMap.

Option      : --output-devtool-namespace
Type        : string
Description : Module namespace to use when interpolating filename template string for the sources array in a generated SourceMap. Defaults to `output.library` if not set. It's useful for avoiding runtime collisions in sourcemaps from multiple webpack projects built as libraries.

Option      : --output-enabled-chunk-loading-types
Type        : string[]
Description : The method of loading chunks (methods included by default are 'jsonp' (web), 'importScripts' (WebWorker), 'require' (sync node.js), 'async-node' (async node.js), but others might be added by plugins).

Option      : --output-enabled-chunk-loading-types-reset
Type        : boolean
Description : Clear all items provided in configuration. List of chunk loading types enabled for use by entry points.

Option      : --output-enabled-library-types
Type        : string[]
Description : Type of library (types included by default are 'var', 'module', 'assign', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).

Option      : --output-enabled-library-types-reset
Type        : boolean
Description : Clear all items provided in configuration. List of library types enabled for use by entry points.

Option      : --output-enabled-wasm-loading-types
Type        : string[]
Description : The method of loading WebAssembly Modules (methods included by default are 'fetch' (web/WebWorker), 'async-node' (node.js), but others might be added by plugins).

Option      : --output-enabled-wasm-loading-types-reset
Type        : boolean
Description : Clear all items provided in configuration. List of wasm loading types enabled for use by entry points.

Option      : --output-environment-arrow-function
Type        : boolean
Description : The environment supports arrow functions ('() => { ... }').

Option      : --output-environment-big-int-literal
Type        : boolean
Description : The environment supports BigInt as literal (123n).

Option      : --output-environment-const
Type        : boolean
Description : The environment supports const and let for variable declarations.

Option      : --output-environment-destructuring
Type        : boolean
Description : The environment supports destructuring ('{ a, b } = obj').

Option      : --output-environment-dynamic-import
Type        : boolean
Description : The environment supports an async import() function to import EcmaScript modules.

Option      : --output-environment-for-of
Type        : boolean
Description : The environment supports 'for of' iteration ('for (const x of array) { ... }').

Option      : --output-environment-module
Type        : boolean
Description : The environment supports EcmaScript Module syntax to import EcmaScript modules (import ... from '...').

Option      : --output-filename
Type        : string
Description : Specifies the name of each output file on disk. You must **not** specify an absolute path here! The `output.path` option determines the location on disk the files are written to, filename is used solely for naming the individual files.

Option      : --output-global-object
Type        : string
Description : An expression which is used to address the global object/scope in runtime code.

Option      : --output-hash-digest
Type        : string
Description : Digest type used for the hash.

Option      : --output-hash-digest-length
Type        : number
Description : Number of chars which are used for the hash.

Option      : --output-hash-function
Type        : string
Description : Algorithm used for generation the hash (see node.js crypto package).

Option      : --output-hash-salt
Type        : string
Description : Any string which is added to the hash to salt it.

Option      : --output-hot-update-chunk-filename
Type        : string
Description : The filename of the Hot Update Chunks. They are inside the output.path directory.

Option      : --output-hot-update-global
Type        : string
Description : The global variable used by webpack for loading of hot update chunks.

Option      : --output-hot-update-main-filename
Type        : string
Description : The filename of the Hot Update Main File. It is inside the `output.path` directory.

Option      : --output-iife
Type        : boolean
Description : Wrap javascript code into IIFE's to avoid leaking into global scope.

Option      : --output-import-function-name
Type        : string
Description : The name of the native import() function (can be exchanged for a polyfill).

Option      : --output-import-meta-name
Type        : string
Description : The name of the native import.meta object (can be exchanged for a polyfill).

Option      : --output-library
Type        : string[]
Description : A part of the library name.

Option      : --output-library-reset
Type        : boolean
Description : Clear all items provided in configuration. The name of the library (some types allow unnamed libraries too).

Option      : --output-library-amd
Type        : string
Description : Name of the exposed AMD library in the UMD.

Option      : --output-library-commonjs
Type        : string
Description : Name of the exposed commonjs export in the UMD.

Option      : --output-library-root
Type        : string[]
Description : Part of the name of the property exposed globally by a UMD library.

Option      : --output-library-root-reset
Type        : boolean
Description : Clear all items provided in configuration. Name of the property exposed globally by a UMD library.

Option      : --output-library-auxiliary-comment
Type        : string
Description : Append the same comment above each import style.

Option      : --output-library-auxiliary-comment-amd
Type        : string
Description : Set comment for `amd` section in UMD.

Option      : --output-library-auxiliary-comment-commonjs
Type        : string
Description : Set comment for `commonjs` (exports) section in UMD.

Option      : --output-library-auxiliary-comment-commonjs2
Type        : string
Description : Set comment for `commonjs2` (module.exports) section in UMD.

Option      : --output-library-auxiliary-comment-root
Type        : string
Description : Set comment for `root` (global variable) section in UMD.

Option      : --output-library-export
Type        : string[]
Description : Part of the export that should be exposed as library.

Option      : --output-library-export-reset
Type        : boolean
Description : Clear all items provided in configuration. Specify which export should be exposed as library.

Option      : --output-library-name
Type        : string[]
Description : A part of the library name.

Option      : --output-library-name-reset
Type        : boolean
Description : Clear all items provided in configuration. The name of the library (some types allow unnamed libraries too).

Option      : --output-library-name-amd
Type        : string
Description : Name of the exposed AMD library in the UMD.

Option      : --output-library-name-commonjs
Type        : string
Description : Name of the exposed commonjs export in the UMD.

Option      : --output-library-name-root
Type        : string[]
Description : Part of the name of the property exposed globally by a UMD library.

Option      : --output-library-name-root-reset
Type        : boolean
Description : Clear all items provided in configuration. Name of the property exposed globally by a UMD library.

Option      : --output-library-type
Type        : string
Description : Type of library (types included by default are 'var', 'module', 'assign', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).

Option      : --output-library-umd-named-define
Type        : boolean
Description : If `output.libraryTarget` is set to umd and `output.library` is set, setting this to true will name the AMD module.

Option      : --output-module
Type        : boolean
Description : Output javascript files as module source type.

Option      : --output-path
Type        : string
Description : Output location of the file generated by webpack e.g. ./dist/

Option      : --output-pathinfo
Type        : boolean
Description : Include comments with information about the modules.

Option      : --output-public-path
Type        : string
Description : The `publicPath` specifies the public URL address of the output files when referenced in a browser.

Option      : --output-script-type
Type        : string
Description : This option enables loading async chunks via a custom script type, such as script type="module".

Option      : --output-source-map-filename
Type        : string
Description : The filename of the SourceMaps for the JavaScript files. They are inside the `output.path` directory.

Option      : --output-source-prefix
Type        : string
Description : Prefixes every line of the source in the bundle with this string.

Option      : --output-strict-module-exception-handling
Type        : boolean
Description : Handles exceptions in module loading correctly at a performance cost.

Option      : --output-unique-name
Type        : string
Description : A unique name of the webpack build to avoid multiple webpack runtimes to conflict when using globals.

Option      : --output-wasm-loading
Type        : string
Description : The method of loading WebAssembly Modules (methods included by default are 'fetch' (web/WebWorker), 'async-node' (node.js), but others might be added by plugins).

Option      : --output-webassembly-module-filename
Type        : string
Description : The filename of WebAssembly modules as relative path inside the `output.path` directory.

Option      : --output-worker-chunk-loading
Type        : string
Description : The method of loading chunks (methods included by default are 'jsonp' (web), 'importScripts' (WebWorker), 'require' (sync node.js), 'async-node' (async node.js), but others might be added by plugins).

Option      : --output-worker-wasm-loading
Type        : string
Description : The method of loading WebAssembly Modules (methods included by default are 'fetch' (web/WebWorker), 'async-node' (node.js), but others might be added by plugins).

Option      : --parallelism
Type        : number
Description : The number of parallel processed modules in the compilation.

Option      : --performance
Type        : boolean
Description : Configuration for web performance recommendations.

Option      : --performance-hints
Type        : string
Description : Sets the format of the hints: warnings, errors or nothing at all.

Option      : --performance-max-asset-size
Type        : number
Description : File size limit (in bytes) when exceeded, that webpack will provide performance hints.

Option      : --performance-max-entrypoint-size
Type        : number
Description : Total size of an entry point (in bytes).

Option      : --profile
Type        : boolean
Description : Capture timing information for each module.

Option      : --records-input-path
Type        : string
Description : Store compiler state to a json file.

Option      : --records-output-path
Type        : string
Description : Load compiler state from a json file.

Option      : --records-path
Type        : string
Description : Store/Load compiler state from/to a json file. This will result in persistent ids of modules and chunks. An absolute path is expected. `recordsPath` is used for `recordsInputPath` and `recordsOutputPath` if they left undefined.

Option      : --resolve-alias-alias
Type        : string[]
Description : Ignore request (replace with empty module). New request.

Option      : --resolve-alias-name
Type        : string[]
Description : Request to be redirected.

Option      : --resolve-alias-only-module
Type        : boolean[]
Description : Redirect only exact matching request.

Option      : --resolve-alias-reset
Type        : boolean
Description : Clear all items provided in configuration. Redirect module requests.

Option      : --resolve-alias-fields
Type        : string[]
Description : Field in the description file (usually package.json) which are used to redirect requests inside the module.

Option      : --resolve-alias-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Fields in the description file (usually package.json) which are used to redirect requests inside the module.

Option      : --resolve-cache
Type        : boolean
Description : Enable caching of successfully resolved requests (cache entries are revalidated).

Option      : --resolve-cache-with-context
Type        : boolean
Description : Include the context information in the cache identifier when caching.

Option      : --resolve-condition-names
Type        : string[]
Description : Condition names for exports field entry point.

Option      : --resolve-condition-names-reset
Type        : boolean
Description : Clear all items provided in configuration. Condition names for exports field entry point.

Option      : --resolve-description-files
Type        : string[]
Description : Filename used to find a description file (like a package.json).

Option      : --resolve-description-files-reset
Type        : boolean
Description : Clear all items provided in configuration. Filenames used to find a description file (like a package.json).

Option      : --resolve-enforce-extension
Type        : boolean
Description : Enforce the resolver to use one of the extensions from the extensions option (User must specify requests without extension).

Option      : --resolve-exports-fields
Type        : string[]
Description : Field name from the description file (usually package.json) which is used to provide entry points of a package.

Option      : --resolve-exports-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Field names from the description file (usually package.json) which are used to provide entry points of a package.

Option      : --resolve-extensions
Type        : string[]
Description : Extension added to the request when trying to find the file.

Option      : --resolve-extensions-reset
Type        : boolean
Description : Clear all items provided in configuration. Extensions added to the request when trying to find the file.

Option      : --resolve-fallback-alias
Type        : string[]
Description : Ignore request (replace with empty module). New request.

Option      : --resolve-fallback-name
Type        : string[]
Description : Request to be redirected.

Option      : --resolve-fallback-only-module
Type        : boolean[]
Description : Redirect only exact matching request.

Option      : --resolve-fallback-reset
Type        : boolean
Description : Clear all items provided in configuration. Redirect module requests.

Option      : --resolve-fully-specified
Type        : boolean
Description : Treats the request specified by the user as fully specified, meaning no extensions are added and the mainFiles in directories are not resolved (This doesn't affect requests from mainFields, aliasFields or aliases).

Option      : --resolve-imports-fields
Type        : string[]
Description : Field name from the description file (usually package.json) which is used to provide internal request of a package (requests starting with # are considered as internal).

Option      : --resolve-imports-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Field names from the description file (usually package.json) which are used to provide internal request of a package (requests starting with # are considered as internal).

Option      : --resolve-main-fields
Type        : string[]
Description : Field name from the description file (package.json) which are used to find the default entry point.

Option      : --resolve-main-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Field names from the description file (package.json) which are used to find the default entry point.

Option      : --resolve-main-files
Type        : string[]
Description : Filename used to find the default entry point if there is no description file or main field.

Option      : --resolve-main-files-reset
Type        : boolean
Description : Clear all items provided in configuration. Filenames used to find the default entry point if there is no description file or main field.

Option      : --resolve-modules
Type        : string[]
Description : Folder name or directory path where to find modules.

Option      : --resolve-modules-reset
Type        : boolean
Description : Clear all items provided in configuration. Folder names or directory paths where to find modules.

Option      : --resolve-prefer-relative
Type        : boolean
Description : Prefer to resolve module requests as relative request and fallback to resolving as module.

Option      : --resolve-restrictions
Type        : string[]
Description : Resolve restriction. Resolve result must fulfill this restriction.

Option      : --resolve-restrictions-reset
Type        : boolean
Description : Clear all items provided in configuration. A list of resolve restrictions. Resolve results must fulfill all of these restrictions to resolve successfully. Other resolve paths are taken when restrictions are not met.

Option      : --resolve-roots
Type        : string[]
Description : Directory in which requests that are server-relative URLs (starting with '/') are resolved.

Option      : --resolve-roots-reset
Type        : boolean
Description : Clear all items provided in configuration. A list of directories in which requests that are server-relative URLs (starting with '/') are resolved. On non-windows system these requests are tried to resolve as absolute path first.

Option      : --resolve-symlinks
Type        : boolean
Description : Enable resolving symlinks to the original location.

Option      : --resolve-unsafe-cache
Type        : boolean
Description : Enable caching of successfully resolved requests (cache entries are not revalidated).

Option      : --resolve-use-sync-file-system-calls
Type        : boolean
Description : Use synchronous filesystem calls for the resolver.

Option      : --resolve-loader-alias-alias
Type        : string[]
Description : Ignore request (replace with empty module). New request.

Option      : --resolve-loader-alias-name
Type        : string[]
Description : Request to be redirected.

Option      : --resolve-loader-alias-only-module
Type        : boolean[]
Description : Redirect only exact matching request.

Option      : --resolve-loader-alias-reset
Type        : boolean
Description : Clear all items provided in configuration. Redirect module requests.

Option      : --resolve-loader-alias-fields
Type        : string[]
Description : Field in the description file (usually package.json) which are used to redirect requests inside the module.

Option      : --resolve-loader-alias-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Fields in the description file (usually package.json) which are used to redirect requests inside the module.

Option      : --resolve-loader-cache
Type        : boolean
Description : Enable caching of successfully resolved requests (cache entries are revalidated).

Option      : --resolve-loader-cache-with-context
Type        : boolean
Description : Include the context information in the cache identifier when caching.

Option      : --resolve-loader-condition-names
Type        : string[]
Description : Condition names for exports field entry point.

Option      : --resolve-loader-condition-names-reset
Type        : boolean
Description : Clear all items provided in configuration. Condition names for exports field entry point.

Option      : --resolve-loader-description-files
Type        : string[]
Description : Filename used to find a description file (like a package.json).

Option      : --resolve-loader-description-files-reset
Type        : boolean
Description : Clear all items provided in configuration. Filenames used to find a description file (like a package.json).

Option      : --resolve-loader-enforce-extension
Type        : boolean
Description : Enforce the resolver to use one of the extensions from the extensions option (User must specify requests without extension).

Option      : --resolve-loader-exports-fields
Type        : string[]
Description : Field name from the description file (usually package.json) which is used to provide entry points of a package.

Option      : --resolve-loader-exports-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Field names from the description file (usually package.json) which are used to provide entry points of a package.

Option      : --resolve-loader-extensions
Type        : string[]
Description : Extension added to the request when trying to find the file.

Option      : --resolve-loader-extensions-reset
Type        : boolean
Description : Clear all items provided in configuration. Extensions added to the request when trying to find the file.

Option      : --resolve-loader-fallback-alias
Type        : string[]
Description : Ignore request (replace with empty module). New request.

Option      : --resolve-loader-fallback-name
Type        : string[]
Description : Request to be redirected.

Option      : --resolve-loader-fallback-only-module
Type        : boolean[]
Description : Redirect only exact matching request.

Option      : --resolve-loader-fallback-reset
Type        : boolean
Description : Clear all items provided in configuration. Redirect module requests.

Option      : --resolve-loader-fully-specified
Type        : boolean
Description : Treats the request specified by the user as fully specified, meaning no extensions are added and the mainFiles in directories are not resolved (This doesn't affect requests from mainFields, aliasFields or aliases).

Option      : --resolve-loader-imports-fields
Type        : string[]
Description : Field name from the description file (usually package.json) which is used to provide internal request of a package (requests starting with # are considered as internal).

Option      : --resolve-loader-imports-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Field names from the description file (usually package.json) which are used to provide internal request of a package (requests starting with # are considered as internal).

Option      : --resolve-loader-main-fields
Type        : string[]
Description : Field name from the description file (package.json) which are used to find the default entry point.

Option      : --resolve-loader-main-fields-reset
Type        : boolean
Description : Clear all items provided in configuration. Field names from the description file (package.json) which are used to find the default entry point.

Option      : --resolve-loader-main-files
Type        : string[]
Description : Filename used to find the default entry point if there is no description file or main field.

Option      : --resolve-loader-main-files-reset
Type        : boolean
Description : Clear all items provided in configuration. Filenames used to find the default entry point if there is no description file or main field.

Option      : --resolve-loader-modules
Type        : string[]
Description : Folder name or directory path where to find modules.

Option      : --resolve-loader-modules-reset
Type        : boolean
Description : Clear all items provided in configuration. Folder names or directory paths where to find modules.

Option      : --resolve-loader-prefer-relative
Type        : boolean
Description : Prefer to resolve module requests as relative request and fallback to resolving as module.

Option      : --resolve-loader-restrictions
Type        : string[]
Description : Resolve restriction. Resolve result must fulfill this restriction.

Option      : --resolve-loader-restrictions-reset
Type        : boolean
Description : Clear all items provided in configuration. A list of resolve restrictions. Resolve results must fulfill all of these restrictions to resolve successfully. Other resolve paths are taken when restrictions are not met.

Option      : --resolve-loader-roots
Type        : string[]
Description : Directory in which requests that are server-relative URLs (starting with '/') are resolved.

Option      : --resolve-loader-roots-reset
Type        : boolean
Description : Clear all items provided in configuration. A list of directories in which requests that are server-relative URLs (starting with '/') are resolved. On non-windows system these requests are tried to resolve as absolute path first.

Option      : --resolve-loader-symlinks
Type        : boolean
Description : Enable resolving symlinks to the original location.

Option      : --resolve-loader-unsafe-cache
Type        : boolean
Description : Enable caching of successfully resolved requests (cache entries are not revalidated).

Option      : --resolve-loader-use-sync-file-system-calls
Type        : boolean
Description : Use synchronous filesystem calls for the resolver.

Option      : --snapshot-build-dependencies-hash
Type        : boolean
Description : Use hashes of the content of the files/directories to determine invalidation.

Option      : --snapshot-build-dependencies-timestamp
Type        : boolean
Description : Use timestamps of the files/directories to determine invalidation.

Option      : --snapshot-immutable-paths
Type        : string[]
Description : A path to a immutable directory (usually a package manager cache directory).

Option      : --snapshot-immutable-paths-reset
Type        : boolean
Description : Clear all items provided in configuration. List of paths that are managed by a package manager and contain a version or hash in its path so all files are immutable.

Option      : --snapshot-managed-paths
Type        : string[]
Description : A path to a managed directory (usually a node_modules directory).

Option      : --snapshot-managed-paths-reset
Type        : boolean
Description : Clear all items provided in configuration. List of paths that are managed by a package manager and can be trusted to not be modified otherwise.

Option      : --snapshot-module-hash
Type        : boolean
Description : Use hashes of the content of the files/directories to determine invalidation.

Option      : --snapshot-module-timestamp
Type        : boolean
Description : Use timestamps of the files/directories to determine invalidation.

Option      : --snapshot-resolve-hash
Type        : boolean
Description : Use hashes of the content of the files/directories to determine invalidation.

Option      : --snapshot-resolve-timestamp
Type        : boolean
Description : Use timestamps of the files/directories to determine invalidation.

Option      : --snapshot-resolve-build-dependencies-hash
Type        : boolean
Description : Use hashes of the content of the files/directories to determine invalidation.

Option      : --snapshot-resolve-build-dependencies-timestamp
Type        : boolean
Description : Use timestamps of the files/directories to determine invalidation.

Option      : --stats
Type        : string, boolean
Description : It instructs webpack on how to treat the stats e.g. verbose

Option      : --stats-all
Type        : boolean
Description : Fallback value for stats options when an option is not defined (has precedence over local webpack defaults).

Option      : --stats-assets
Type        : boolean
Description : Add assets information.

Option      : --stats-assets-sort
Type        : string
Description : Sort the assets by that field.

Option      : --stats-assets-space
Type        : number
Description : Space to display assets (groups will be collapsed to fit this space).

Option      : --stats-built-at
Type        : boolean
Description : Add built at time information.

Option      : --stats-cached
Type        : boolean
Description : Add information about cached (not built) modules.

Option      : --stats-cached-assets
Type        : boolean
Description : Show cached assets (setting this to `false` only shows emitted files).

Option      : --stats-cached-modules
Type        : boolean
Description : Add information about cached (not built) modules.

Option      : --stats-children
Type        : boolean
Description : Add children information.

Option      : --stats-chunk-group-auxiliary
Type        : boolean
Description : Display auxiliary assets in chunk groups.

Option      : --stats-chunk-group-children
Type        : boolean
Description : Display children of chunk groups.

Option      : --stats-chunk-group-max-assets
Type        : number
Description : Limit of assets displayed in chunk groups.

Option      : --stats-chunk-groups
Type        : boolean
Description : Display all chunk groups with the corresponding bundles.

Option      : --stats-chunk-modules
Type        : boolean
Description : Add built modules information to chunk information.

Option      : --stats-chunk-origins
Type        : boolean
Description : Add the origins of chunks and chunk merging info.

Option      : --stats-chunk-relations
Type        : boolean
Description : Add information about parent, children and sibling chunks to chunk information.

Option      : --stats-chunks
Type        : boolean
Description : Add chunk information.

Option      : --stats-chunks-sort
Type        : string
Description : Sort the chunks by that field.

Option      : --stats-colors
Type        : boolean
Description : Enables/Disables colorful output.

Option      : --stats-colors-bold
Type        : string
Description : Custom color for bold text.

Option      : --stats-colors-cyan
Type        : string
Description : Custom color for cyan text.

Option      : --stats-colors-green
Type        : string
Description : Custom color for green text.

Option      : --stats-colors-magenta
Type        : string
Description : Custom color for magenta text.

Option      : --stats-colors-red
Type        : string
Description : Custom color for red text.

Option      : --stats-colors-yellow
Type        : string
Description : Custom color for yellow text.

Option      : --stats-context
Type        : string
Description : Context directory for request shortening.

Option      : --stats-dependent-modules
Type        : boolean
Description : Show chunk modules that are dependencies of other modules of the chunk.

Option      : --stats-depth
Type        : boolean
Description : Add module depth in module graph.

Option      : --stats-entrypoints
Type        : string
Description : Display the entry points with the corresponding bundles.

Option      : --stats-env
Type        : boolean
Description : Add --env information.

Option      : --stats-error-details
Type        : boolean
Description : Add details to errors (like resolving log).

Option      : --stats-error-stack
Type        : boolean
Description : Add internal stack trace to errors.

Option      : --stats-errors
Type        : boolean
Description : Add errors.

Option      : --stats-errors-count
Type        : boolean
Description : Add errors count.

Option      : --stats-exclude-assets
Type        : string[]
Description : Suppress assets that match the specified filters. Filters can be Strings, RegExps or Functions.

Option      : --stats-exclude-assets-reset
Type        : boolean
Description : Clear all items provided in configuration. Suppress assets that match the specified filters. Filters can be Strings, RegExps or Functions.

Option      : --stats-exclude-modules
Type        : string[]
Description : Suppress modules that match the specified filters. Filters can be Strings, RegExps, Booleans or Functions.

Option      : --stats-exclude-modules-reset
Type        : boolean
Description : Clear all items provided in configuration. Suppress modules that match the specified filters. Filters can be Strings, RegExps, Booleans or Functions.

Option      : --stats-group-assets-by-chunk
Type        : boolean
Description : Group assets by how their are related to chunks.

Option      : --stats-group-assets-by-emit-status
Type        : boolean
Description : Group assets by their status (emitted, compared for emit or cached).

Option      : --stats-group-assets-by-extension
Type        : boolean
Description : Group assets by their extension.

Option      : --stats-group-assets-by-info
Type        : boolean
Description : Group assets by their asset info (immutable, development, hotModuleReplacement, etc).

Option      : --stats-group-assets-by-path
Type        : boolean
Description : Group assets by their path.

Option      : --stats-group-modules-by-attributes
Type        : boolean
Description : Group modules by their attributes (errors, warnings, assets, optional, orphan, or dependent).

Option      : --stats-group-modules-by-cache-status
Type        : boolean
Description : Group modules by their status (cached or built and cacheable).

Option      : --stats-group-modules-by-extension
Type        : boolean
Description : Group modules by their extension.

Option      : --stats-group-modules-by-path
Type        : boolean
Description : Group modules by their path.

Option      : --stats-hash
Type        : boolean
Description : Add the hash of the compilation.

Option      : --stats-ids
Type        : boolean
Description : Add ids.

Option      : --stats-logging
Type        : string
Description : Specify log level of logging output. Enable/disable logging output (`true`: shows normal logging output, loglevel: log).

Option      : --stats-logging-debug
Type        : string[]
Description : Enable/Disable debug logging for all loggers. Include debug logging of specified loggers (i. e. for plugins or loaders). Filters can be Strings, RegExps or Functions.

Option      : --stats-logging-debug-reset
Type        : boolean
Description : Clear all items provided in configuration. Include debug logging of specified loggers (i. e. for plugins or loaders). Filters can be Strings, RegExps or Functions.

Option      : --stats-logging-trace
Type        : boolean
Description : Add stack traces to logging output.

Option      : --stats-module-assets
Type        : boolean
Description : Add information about assets inside modules.

Option      : --stats-module-trace
Type        : boolean
Description : Add dependencies and origin of warnings/errors.

Option      : --stats-modules
Type        : boolean
Description : Add built modules information.

Option      : --stats-modules-sort
Type        : string
Description : Sort the modules by that field.

Option      : --stats-modules-space
Type        : number
Description : Space to display modules (groups will be collapsed to fit this space, values is in number of modules/groups).

Option      : --stats-nested-modules
Type        : boolean
Description : Add information about modules nested in other modules (like with module concatenation).

Option      : --stats-optimization-bailout
Type        : boolean
Description : Show reasons why optimization bailed out for modules.

Option      : --stats-orphan-modules
Type        : boolean
Description : Add information about orphan modules.

Option      : --stats-output-path
Type        : boolean
Description : Add output path information.

Option      : --stats-performance
Type        : boolean
Description : Add performance hint flags.

Option      : --stats-preset
Type        : string
Description : Preset for the default values.

Option      : --stats-provided-exports
Type        : boolean
Description : Show exports provided by modules.

Option      : --stats-public-path
Type        : boolean
Description : Add public path information.

Option      : --stats-reasons
Type        : boolean
Description : Add information about the reasons why modules are included.

Option      : --stats-related-assets
Type        : boolean
Description : Add information about assets that are related to other assets (like SourceMaps for assets).

Option      : --stats-runtime-modules
Type        : boolean
Description : Add information about runtime modules.

Option      : --stats-source
Type        : boolean
Description : Add the source code of modules.

Option      : --stats-timings
Type        : boolean
Description : Add timing information.

Option      : --stats-used-exports
Type        : boolean
Description : Show exports used by modules.

Option      : --stats-version
Type        : boolean
Description : Add webpack version information.

Option      : --stats-warnings
Type        : boolean
Description : Add warnings.

Option      : --stats-warnings-count
Type        : boolean
Description : Add warnings count.

Option      : --stats-warnings-filter
Type        : string[]
Description : Suppress listing warnings that match the specified filters (they will still be counted). Filters can be Strings, RegExps or Functions.

Option      : --stats-warnings-filter-reset
Type        : boolean
Description : Clear all items provided in configuration. Suppress listing warnings that match the specified filters (they will still be counted). Filters can be Strings, RegExps or Functions.

Option      : --target
Type        : string[]
Description : Sets the build target e.g. node

Option      : --target-reset
Type        : boolean
Description : Clear all items provided in configuration. Environment to build for. An array of environments to build for all of them when possible.

Option      : --watch
Type        : boolean
Description : Watch for files changes

Option      : --watch-options-aggregate-timeout
Type        : number
Description : Delay the rebuilt after the first change. Value is a time in ms.

Option      : --watch-options-follow-symlinks
Type        : boolean
Description : Resolve symlinks and watch symlink and real file. This is usually not needed as webpack already resolves symlinks ('resolve.symlinks').

Option      : --watch-options-ignored
Type        : string[]
Description : A glob pattern for files that should be ignored from watching. Ignore some files from watching (glob pattern or regexp).

Option      : --watch-options-ignored-reset
Type        : boolean
Description : Clear all items provided in configuration. Ignore some files from watching (glob pattern or regexp).

Option      : --watch-options-poll
Type        : string
Description : `number`: use polling with specified interval. `true`: use polling.

Option      : --watch-options-stdin
Type        : boolean
Description : Stop watching when stdin stream has ended.

Option      : --no-hot
Type        : boolean
Description : Disables Hot Module Replacement

Option      : --no-color
Type        : boolean
Description : Disable colors on console

Option      : --no-amd
Type        : boolean
Description : Negates amd

Option      : --no-bail
Type        : boolean
Description : Negates bail

Option      : --no-cache
Type        : boolean
Description : Negates cache

Option      : --no-devtool
Type        : boolean
Description : Do not generate source maps

Option      : --no-experiments-asset
Type        : boolean
Description : Negates experiments-asset

Option      : --no-experiments-async-web-assembly
Type        : boolean
Description : Negates experiments-async-web-assembly

Option      : --no-experiments-output-module
Type        : boolean
Description : Negates experiments-output-module

Option      : --no-experiments-sync-web-assembly
Type        : boolean
Description : Negates experiments-sync-web-assembly

Option      : --no-experiments-top-level-await
Type        : boolean
Description : Negates experiments-top-level-await

Option      : --no-externals-presets-electron
Type        : boolean
Description : Negates externals-presets-electron

Option      : --no-externals-presets-electron-main
Type        : boolean
Description : Negates externals-presets-electron-main

Option      : --no-externals-presets-electron-preload
Type        : boolean
Description : Negates externals-presets-electron-preload

Option      : --no-externals-presets-electron-renderer
Type        : boolean
Description : Negates externals-presets-electron-renderer

Option      : --no-externals-presets-node
Type        : boolean
Description : Negates externals-presets-node

Option      : --no-externals-presets-nwjs
Type        : boolean
Description : Negates externals-presets-nwjs

Option      : --no-externals-presets-web
Type        : boolean
Description : Negates externals-presets-web

Option      : --no-externals-presets-web-async
Type        : boolean
Description : Negates externals-presets-web-async

Option      : --no-module-expr-context-critical
Type        : boolean
Description : Negates module-expr-context-critical

Option      : --no-module-expr-context-recursive
Type        : boolean
Description : Negates module-expr-context-recursive

Option      : --no-module-rules-side-effects
Type        : boolean
Description : Negates module-rules-side-effects

Option      : --no-module-strict-export-presence
Type        : boolean
Description : Negates module-strict-export-presence

Option      : --no-module-strict-this-context-on-imports
Type        : boolean
Description : Negates module-strict-this-context-on-imports

Option      : --no-module-unknown-context-critical
Type        : boolean
Description : Negates module-unknown-context-critical

Option      : --no-module-unknown-context-recursive
Type        : boolean
Description : Negates module-unknown-context-recursive

Option      : --no-module-unsafe-cache
Type        : boolean
Description : Negates module-unsafe-cache

Option      : --no-module-wrapped-context-critical
Type        : boolean
Description : Negates module-wrapped-context-critical

Option      : --no-module-wrapped-context-recursive
Type        : boolean
Description : Negates module-wrapped-context-recursive

Option      : --no-node
Type        : boolean
Description : Negates node

Option      : --no-node-global
Type        : boolean
Description : Negates node-global

Option      : --no-optimization-check-wasm-types
Type        : boolean
Description : Negates optimization-check-wasm-types

Option      : --no-optimization-concatenate-modules
Type        : boolean
Description : Negates optimization-concatenate-modules

Option      : --no-optimization-emit-on-errors
Type        : boolean
Description : Negates optimization-emit-on-errors

Option      : --no-optimization-flag-included-chunks
Type        : boolean
Description : Negates optimization-flag-included-chunks

Option      : --no-optimization-inner-graph
Type        : boolean
Description : Negates optimization-inner-graph

Option      : --no-optimization-mangle-wasm-imports
Type        : boolean
Description : Negates optimization-mangle-wasm-imports

Option      : --no-optimization-merge-duplicate-chunks
Type        : boolean
Description : Negates optimization-merge-duplicate-chunks

Option      : --no-optimization-minimize
Type        : boolean
Description : Negates optimization-minimize

Option      : --no-optimization-portable-records
Type        : boolean
Description : Negates optimization-portable-records

Option      : --no-optimization-provided-exports
Type        : boolean
Description : Negates optimization-provided-exports

Option      : --no-optimization-real-content-hash
Type        : boolean
Description : Negates optimization-real-content-hash

Option      : --no-optimization-remove-available-modules
Type        : boolean
Description : Negates optimization-remove-available-modules

Option      : --no-optimization-remove-empty-chunks
Type        : boolean
Description : Negates optimization-remove-empty-chunks

Option      : --no-optimization-split-chunks
Type        : boolean
Description : Negates optimization-split-chunks

Option      : --no-optimization-split-chunks-hide-path-info
Type        : boolean
Description : Negates optimization-split-chunks-hide-path-info

Option      : --no-optimization-split-chunks-used-exports
Type        : boolean
Description : Negates optimization-split-chunks-used-exports

Option      : --no-output-charset
Type        : boolean
Description : Negates output-charset

Option      : --no-output-compare-before-emit
Type        : boolean
Description : Negates output-compare-before-emit

Option      : --no-output-environment-arrow-function
Type        : boolean
Description : Negates output-environment-arrow-function

Option      : --no-output-environment-big-int-literal
Type        : boolean
Description : Negates output-environment-big-int-literal

Option      : --no-output-environment-const
Type        : boolean
Description : Negates output-environment-const

Option      : --no-output-environment-destructuring
Type        : boolean
Description : Negates output-environment-destructuring

Option      : --no-output-environment-dynamic-import
Type        : boolean
Description : Negates output-environment-dynamic-import

Option      : --no-output-environment-for-of
Type        : boolean
Description : Negates output-environment-for-of

Option      : --no-output-environment-module
Type        : boolean
Description : Negates output-environment-module

Option      : --no-output-iife
Type        : boolean
Description : Negates output-iife

Option      : --no-output-library-umd-named-define
Type        : boolean
Description : Negates output-library-umd-named-define

Option      : --no-output-module
Type        : boolean
Description : Negates output-module

Option      : --no-output-pathinfo
Type        : boolean
Description : Negates output-pathinfo

Option      : --no-output-strict-module-exception-handling
Type        : boolean
Description : Negates output-strict-module-exception-handling

Option      : --no-performance
Type        : boolean
Description : Negates performance

Option      : --no-profile
Type        : boolean
Description : Negates profile

Option      : --no-resolve-alias-only-module
Type        : boolean
Description : Negates resolve-alias-only-module

Option      : --no-resolve-cache
Type        : boolean
Description : Negates resolve-cache

Option      : --no-resolve-cache-with-context
Type        : boolean
Description : Negates resolve-cache-with-context

Option      : --no-resolve-enforce-extension
Type        : boolean
Description : Negates resolve-enforce-extension

Option      : --no-resolve-fallback-only-module
Type        : boolean
Description : Negates resolve-fallback-only-module

Option      : --no-resolve-fully-specified
Type        : boolean
Description : Negates resolve-fully-specified

Option      : --no-resolve-prefer-relative
Type        : boolean
Description : Negates resolve-prefer-relative

Option      : --no-resolve-symlinks
Type        : boolean
Description : Negates resolve-symlinks

Option      : --no-resolve-unsafe-cache
Type        : boolean
Description : Negates resolve-unsafe-cache

Option      : --no-resolve-use-sync-file-system-calls
Type        : boolean
Description : Negates resolve-use-sync-file-system-calls

Option      : --no-resolve-loader-alias-only-module
Type        : boolean
Description : Negates resolve-loader-alias-only-module

Option      : --no-resolve-loader-cache
Type        : boolean
Description : Negates resolve-loader-cache

Option      : --no-resolve-loader-cache-with-context
Type        : boolean
Description : Negates resolve-loader-cache-with-context

Option      : --no-resolve-loader-enforce-extension
Type        : boolean
Description : Negates resolve-loader-enforce-extension

Option      : --no-resolve-loader-fallback-only-module
Type        : boolean
Description : Negates resolve-loader-fallback-only-module

Option      : --no-resolve-loader-fully-specified
Type        : boolean
Description : Negates resolve-loader-fully-specified

Option      : --no-resolve-loader-prefer-relative
Type        : boolean
Description : Negates resolve-loader-prefer-relative

Option      : --no-resolve-loader-symlinks
Type        : boolean
Description : Negates resolve-loader-symlinks

Option      : --no-resolve-loader-unsafe-cache
Type        : boolean
Description : Negates resolve-loader-unsafe-cache

Option      : --no-resolve-loader-use-sync-file-system-calls
Type        : boolean
Description : Negates resolve-loader-use-sync-file-system-calls

Option      : --no-snapshot-build-dependencies-hash
Type        : boolean
Description : Negates snapshot-build-dependencies-hash

Option      : --no-snapshot-build-dependencies-timestamp
Type        : boolean
Description : Negates snapshot-build-dependencies-timestamp

Option      : --no-snapshot-module-hash
Type        : boolean
Description : Negates snapshot-module-hash

Option      : --no-snapshot-module-timestamp
Type        : boolean
Description : Negates snapshot-module-timestamp

Option      : --no-snapshot-resolve-hash
Type        : boolean
Description : Negates snapshot-resolve-hash

Option      : --no-snapshot-resolve-timestamp
Type        : boolean
Description : Negates snapshot-resolve-timestamp

Option      : --no-snapshot-resolve-build-dependencies-hash
Type        : boolean
Description : Negates snapshot-resolve-build-dependencies-hash

Option      : --no-snapshot-resolve-build-dependencies-timestamp
Type        : boolean
Description : Negates snapshot-resolve-build-dependencies-timestamp

Option      : --no-stats
Type        : boolean
Description : Disable stats output

Option      : --no-stats-all
Type        : boolean
Description : Negates stats-all

Option      : --no-stats-assets
Type        : boolean
Description : Negates stats-assets

Option      : --no-stats-built-at
Type        : boolean
Description : Negates stats-built-at

Option      : --no-stats-cached
Type        : boolean
Description : Negates stats-cached

Option      : --no-stats-cached-assets
Type        : boolean
Description : Negates stats-cached-assets

Option      : --no-stats-cached-modules
Type        : boolean
Description : Negates stats-cached-modules

Option      : --no-stats-children
Type        : boolean
Description : Negates stats-children

Option      : --no-stats-chunk-group-auxiliary
Type        : boolean
Description : Negates stats-chunk-group-auxiliary

Option      : --no-stats-chunk-group-children
Type        : boolean
Description : Negates stats-chunk-group-children

Option      : --no-stats-chunk-groups
Type        : boolean
Description : Negates stats-chunk-groups

Option      : --no-stats-chunk-modules
Type        : boolean
Description : Negates stats-chunk-modules

Option      : --no-stats-chunk-origins
Type        : boolean
Description : Negates stats-chunk-origins

Option      : --no-stats-chunk-relations
Type        : boolean
Description : Negates stats-chunk-relations

Option      : --no-stats-chunks
Type        : boolean
Description : Negates stats-chunks

Option      : --no-stats-colors
Type        : boolean
Description : Negates stats-colors

Option      : --no-stats-dependent-modules
Type        : boolean
Description : Negates stats-dependent-modules

Option      : --no-stats-depth
Type        : boolean
Description : Negates stats-depth

Option      : --no-stats-env
Type        : boolean
Description : Negates stats-env

Option      : --no-stats-error-details
Type        : boolean
Description : Negates stats-error-details

Option      : --no-stats-error-stack
Type        : boolean
Description : Negates stats-error-stack

Option      : --no-stats-errors
Type        : boolean
Description : Negates stats-errors

Option      : --no-stats-errors-count
Type        : boolean
Description : Negates stats-errors-count

Option      : --no-stats-group-assets-by-chunk
Type        : boolean
Description : Negates stats-group-assets-by-chunk

Option      : --no-stats-group-assets-by-emit-status
Type        : boolean
Description : Negates stats-group-assets-by-emit-status

Option      : --no-stats-group-assets-by-extension
Type        : boolean
Description : Negates stats-group-assets-by-extension

Option      : --no-stats-group-assets-by-info
Type        : boolean
Description : Negates stats-group-assets-by-info

Option      : --no-stats-group-assets-by-path
Type        : boolean
Description : Negates stats-group-assets-by-path

Option      : --no-stats-group-modules-by-attributes
Type        : boolean
Description : Negates stats-group-modules-by-attributes

Option      : --no-stats-group-modules-by-cache-status
Type        : boolean
Description : Negates stats-group-modules-by-cache-status

Option      : --no-stats-group-modules-by-extension
Type        : boolean
Description : Negates stats-group-modules-by-extension

Option      : --no-stats-group-modules-by-path
Type        : boolean
Description : Negates stats-group-modules-by-path

Option      : --no-stats-hash
Type        : boolean
Description : Negates stats-hash

Option      : --no-stats-ids
Type        : boolean
Description : Negates stats-ids

Option      : --no-stats-logging-trace
Type        : boolean
Description : Negates stats-logging-trace

Option      : --no-stats-module-assets
Type        : boolean
Description : Negates stats-module-assets

Option      : --no-stats-module-trace
Type        : boolean
Description : Negates stats-module-trace

Option      : --no-stats-modules
Type        : boolean
Description : Negates stats-modules

Option      : --no-stats-nested-modules
Type        : boolean
Description : Negates stats-nested-modules

Option      : --no-stats-optimization-bailout
Type        : boolean
Description : Negates stats-optimization-bailout

Option      : --no-stats-orphan-modules
Type        : boolean
Description : Negates stats-orphan-modules

Option      : --no-stats-output-path
Type        : boolean
Description : Negates stats-output-path

Option      : --no-stats-performance
Type        : boolean
Description : Negates stats-performance

Option      : --no-stats-provided-exports
Type        : boolean
Description : Negates stats-provided-exports

Option      : --no-stats-public-path
Type        : boolean
Description : Negates stats-public-path

Option      : --no-stats-reasons
Type        : boolean
Description : Negates stats-reasons

Option      : --no-stats-related-assets
Type        : boolean
Description : Negates stats-related-assets

Option      : --no-stats-runtime-modules
Type        : boolean
Description : Negates stats-runtime-modules

Option      : --no-stats-source
Type        : boolean
Description : Negates stats-source

Option      : --no-stats-timings
Type        : boolean
Description : Negates stats-timings

Option      : --no-stats-used-exports
Type        : boolean
Description : Negates stats-used-exports

Option      : --no-stats-version
Type        : boolean
Description : Negates stats-version

Option      : --no-stats-warnings
Type        : boolean
Description : Negates stats-warnings

Option      : --no-stats-warnings-count
Type        : boolean
Description : Negates stats-warnings-count

Option      : --no-watch
Type        : boolean
Description : Do not watch for file changes

Option      : --no-watch-options-follow-symlinks
Type        : boolean
Description : Negates watch-options-follow-symlinks

Option      : --no-watch-options-stdin
Type        : boolean
Description : Negates watch-options-stdin

                  Made with ♥️  by the webpack team```
````
