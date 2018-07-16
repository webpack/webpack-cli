module.exports = {
    entry: ["string", "object", "function", "array"],
    externals:  ["string", "object", "boolean", "function", "regex", "array"],
    module: {
        type: ["boolean", "regex"],
        properties: {
          exprContextCritical: ["boolean"],
          exprContextRecursive: ["boolean"],
          exprContextregex: ["boolean", "regex"],
          exprContextRequest: ["string"],
          noParse: ["regex", "array", "function", "string"],
          rules: ["array"],
          unknownContextCritical: ["boolean"],
          unknownContextRecursive: ["boolean"],
          unknownContextregex: ["boolean", "regex"],
          unknownContextRequest: ["string"],
          unsafeCache: ["boolean", "function"],
          wrappedContextCritical: ["boolean"],
          wrappedContextRecursive: ["boolean"],
          wrappedContextregex: ["regex"],
          strictExportPresence: ["boolean"],
          strictThisContextOnImports: ["boolean", "object"]
        }
      },
      output: {
        properties: {
          auxiliaryComment: {
                type: ["string", "object"],
                properties: {
                  amd: ["string"],
                  commonjs: ["string"],
                  commonjs2: ["string"],
                  root: ["string"]
                }
          },
          chunkFilename: ["string"],
          webassemblyModuleFilename: ["string"],
          globalobject: ["string"],
          crossOriginLoading: [false, "anonymous", "use-credentials"],
          jsonpScriptType: [false, "text/javascript", "module"],
          chunkLoadTimeout: ["number"],
          devtoolFallbackModuleFilenameTemplate: ["string", "function"],
          devtoolLineToLine: ["boolean", "object"],
          devtoolModuleFilenameTemplate: ["string", "function"],
          devtoolNamespace: ["string"],
          filename: ["string", "function"],
          hashDigest: ["latin1", "hex", "base64"],
          hashDigestLength: ["number"],
          hashfunction: ["string","function"],
          hashSalt: ["string"],
          hotUpdateChunkFilename: ["string","function"],
          hotUpdatefunction: ["string"],
          hotUpdateMainFilename: [ "string", "function"],
          jsonpfunction: ["string"],
          chunkCallbackName: ["string"],
          library: {
            type: [ "string", "array", "object"],
            properties: {
              root: ["string"],
              amd: ["string"],
              commonjs: ["string"]
            }
          },
          libraryTarget: [
              "var",
              "assign",
              "this",
              "window",
              "self",
              "global",
              "commonjs",
              "commonjs2",
              "commonjs-module",
              "amd",
              "umd",
              "umd2",
              "jsonp"
            ],
          libraryExport: ["string"],
          path: ["string"],
          pathinfo: ["boolean"],
          publicPath: ["string", "function"],
          sourceMapFilename: ["string"],
          sourcePrefix: ["string"],
          strictModuleExceptionHandling: ["boolean"],
          umdNamedDefine: ["boolean"]
        }
      },
      resolve: {
        properties: {
          alias: {
            type: [
              {
                additionalProperties: {
                  type: ["string"]
                },
                type: ["object"]
              },
              {
                items: {
                  properties: {
                    alias: ["string"],
                    name: ["string"],
                    onlyModule: ["boolean"]
                  },
                  type: ["object"]
                },
                type : ["array"]
              }
            ]
          },
          aliasFields: ["array"],
          cachePredicate: ["function"],
          cacheWithContext: ["boolean"],
          descriptionFiles: ["array"],
          enforceExtension: ["boolean"],
          enforceModuleExtension: ["boolean"],
          extensions: ["array"],
          fileSystem: [],
          mainFields: ["array"],
          mainFiles: ["array"],
          moduleExtensions: ["array"],
          modules: ["array"],
          plugins: ["array"],
          resolver: [],
          symlinks: ["boolean"],
          concord: ["boolean"],
          unsafeCache: ["boolean", "object"],
          useSyncFileSystemCalls: ["boolean"]
        }
      },
    mode: [
      "development",
      "production",
      "none"
    ],
    amd: [],
    bail: ["boolean"],
    cache: ["boolean", "object"],
      context: ["string"],
      dependencies: {
        items: {
          type: ["string"]
        },
        type: ["array"]
      },
      
      devtool: ["string", false],
      loader: ["object"],
      name: ["string"],
      node: {
        type: [false, "object"],
        properties: {
            object: [
                false,
                true,
                "mock",
                "empty"
              ],
            undefined: {
              Buffer: [
                  false,
                  true,
                  "mock"
                ],
              __dirname: [
                  false,
                  true,
                  "mock"
                ],
              __filename: [
                  false,
                  true,
                  "mock"
              ],
              console:  [
                  false,
                  true,
                  "mock"
                ],
              global: ["boolean"],
              process: [
                  false,
                  true,
                  "mock"
                ]
            }
          }
      },
      optimization: {
        type: ["object"],
        properties: {
          removeAvailableModules: ["boolean"],
          removeEmptyChunks: ["boolean"],
          mergeDuplicateChunks: ["boolean"],
          flagIncludedChunks: ["boolean"],
          occurrenceOrder: ["boolean"],
          sideEffects: ["boolean"],
          providedExports: ["boolean"],
          usedExports: ["boolean"],
          concatenateModules: ["boolean"],
          splitChunks: {
            type: [false],
            TODO: {
                type: ["object"],
                properties: {
                  chunks: {
                    type: [
                      {
                        type: [
                          "initial",
                          "async",
                          "all",
                          "function"
                        ]
                      }
                    ]
                  },
                  minSize: ["number"],
                  minChunks: ["number"],
                  maxAsyncRequests: ["number"],
                  maxInitialRequests: ["number"],
                  name: [ "boolean","function","string"],
                  filename: ["string"],
                  automaticNameDelimiter: ["string"],
                  cacheGroups: {
                    type: ["object"],
                    properties: {
                      type: [false, "function", "string","regex", {
                          type: "object",
                          properties: {
                            test: [ "function", "string", "regex"],
                            chunks: [
                                    "initial",
                                    "async",
                                    "all",
                                    "function"
                            ],
                            enforce: ["boolean"],
                            priority: ["number"],
                            minSize: ["number"],
                            minChunks: ["number"],
                            maxAsyncRequests: ["number"],
                            maxInitialRequests: ["number"],
                            reuseExistingChunk: ["boolean"],
                            name: ["boolean","function", "string"],
                            filename: ["string"]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          runtimeChunk: ["boolean", "single","multiple",  {
              type: "object",
              properties: {
                name: [ "string", "function"]
              }
            }],
          noEmitOnErrors: ["boolean"],
          namedModules: ["boolean"],
          namedChunks: ["boolean"],
          portableRecords:["boolean"],
          minimize: ["boolean"],
          minimizer: {
            type: ["array"],
            properties: []
          },
          nodeEnv: [false, "string"]
      },
      parallelism: ["number"],
      performance: {
        type: [false,
          {
            properties: {
              assetFilter: ["function"],
              hints: [
                  false,
                  "warning",
                  "error"
              ],
              maxEntrypointSize: ["number"],
              maxAssetSize: ["number"]
            },
          }
        ]
      },
      plugins: {
        type: ["array"],
        properties: ["object", "function"]
      },
      profile: ["boolean"],
      recordsInputPath: ["string"],
      recordsOutputPath: ["string"],
      recordsPath: ["string"],
      resolve: [],
      resolveLoader: [],
      serve: ["object"],
      stats: [
          {
            type: ["object"],
            properties: {
              all: ["boolean"],
              context: ["string"],
              hash: ["boolean"],
              version: ["boolean"],
              timings: ["boolean"],
              builtAt: ["boolean"],
              performance: ["boolean"],
              depth: ["boolean"],
              assets: ["boolean"],
              env: ["boolean"],
              colors: {
                oneOf: ["boolean", {
                    type: ["object"],
                    properties: {
                      bold: ["string"],
                      red: ["string"],
                      green: ["string"],
                      cyan: ["string"],
                      magenta: ["string"],
                      yellow: ["string"]
                    }
                  }
                ]
              },
              maxModules: ["number"],
              chunks: ["boolean"],
              chunkModules: ["boolean"],
              modules: ["boolean"],
              nestedModules: ["boolean"],
              moduleAssets: ["boolean"],
              children: ["boolean"],
              cached: ["boolean"],
              cachedAssets: ["boolean"],
              reasons: ["boolean"],
              source: ["boolean"],
              warnings: ["boolean"],
              errors: ["boolean"],
              warningsFilter: [],
              excludeAssets: [],
              excludeModules: ["boolean"],
              exclude: ["boolean"],
              entrypoints: ["boolean"],
              chunkGroups: ["boolean"],
              errorDetails: ["boolean"],
              chunkOrigins: ["boolean"],
              modulesSort: ["string"],
              moduleTrace: ["boolean"],
              chunksSort: ["string"],
              assetsSort: ["string"],
              publicPath: ["boolean"],
              outputPath: ["boolean"],
              providedExports: ["boolean"],
              usedExports: ["boolean"],
              optimizationBailout: ["boolean"]
            }
          },
          {
            type: "boolean"
          },
          {
            type: [
              "none",
              "errors-only",
              "minimal",
              "normal",
              "detailed",
              "verbose"
            ]
          }
        ],
      target: [
              "web",
              "webworker",
              "node",
              "async-node",
              "node-webkit",
              "electron-main",
              "electron-renderer",
              "function"
      ],
      watch: ["boolean"],
      watchOptions: {
        properties: {
          aggregateTimeout: ["number"],
          ignored: [],
          stdin:  ["boolean"],
          poll: ["boolean", "number"]
        }
      }
}
  