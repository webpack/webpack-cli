module.exports = {
    entry: {
      type: ["string", "object", "function", "array"],
    },
    externals: {
      type: ["string", "object", "boolean", "function", "regex", "array"]
    },
    module: {
        type: ["boolean", "regex", {
          exprContextCritical: {
            type: ["boolean"]
          },
          exprContextRecursive: {
            type: ["boolean"]
          },
          exprContextregex: {
            type: ["boolean", "regex"]
          },
          exprContextRequest: {
            type: ["string"]
          },
          noParse: {
            type: ["regex", "array", "function", "string"]
          },
          rules: {
            type: ["array"]
          },
          unknownContextCritical: {
            type: ["boolean"]
          },
          unknownContextRecursive: {
            type: ["boolean"]
          },
          unknownContextregex: {
            type: ["boolean", "regex"]
          },
          unknownContextRequest: {
            type: ["string"],
          },
          unsafeCache: {
            type: ["boolean", "function"],
          },
          wrappedContextCritical: {
            type: ["boolean"]
          },
          wrappedContextRecursive: {
            type: ["boolean"]
          },
          wrappedContextregex: {
            type: ["regex"]
          },
          strictExportPresence: {
            type: ["boolean"],
          },
          strictThisContextOnImports: {
            type: ["boolean", "object"]
          }
        }]
      },
      output: {
        type: [{
          auxiliaryComment: {
                type: ["string", "object"],
                properties: {
                  amd: {
                    type: ["string"]
                  },
                  commonjs: {
                    type: ["string"]
                  },
                  commonjs2: {
                    type: ["string"]
                  },
                }
          },
          chunkFilename: {
            type: ["string"],
          },
          webassemblyModuleFilename: {
            type: ["string"]
          },
          globalobject: {
            type: ["string"],
          },
          crossOriginLoading: {
            type: [false, "anonymous", "use-credentials"],
          },
          jsonpScriptType: {
            type: [false, "text/javascript", "module"],
          },
          chunkLoadTimeout: {
            type: ["number"],
          },
          devtoolFallbackModuleFilenameTemplate: {
            type: ["string", "function"],
          },
          devtoolLineToLine: {
            type: ["boolean", "object"],
          },
          devtoolModuleFilenameTemplate: {
            type: ["string", "function"]
          },
          devtoolNamespace: {
            type: ["string"],
          },
          filename: {
            type: ["string", "function"],
          },
          hashDigest: {
            type: ["latin1", "hex", "base64"],
          },
          hashDigestLength: {
            type: ["number"],
          },
          hashfunction: {
            type: ["string","function"],
          },
          hashSalt: {
            type: ["string"],
          },
          hotUpdateChunkFilename: {
            type: ["string","function"],
          },
          hotUpdatefunction: {
            type: ["string"],
          },
          hotUpdateMainFilename: {
            type: [ "string", "function"],
          },
          jsonpfunction: {
            type: ["string"],
          },
          chunkCallbackName: {
            type: ["string"],
          },
          library: {
            type: [ "string", "array", {
              root: {
                type: ["string"],
              },
              amd: {
                type: ["string"],
              },
              commonjs: {
                type: ["string"]
              }
            }],
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
          libraryExport: {
            type: ["string"],
          },
          path: {
            type: ["string"],
          },
          pathinfo: {
            type: ["boolean"],
          },
          publicPath: {
            type: ["string", "function"],
          },
          sourceMapFilename: {
            type: ["string"],
          },
          sourcePrefix: {
            type: ["string"],
          },
          strictModuleExceptionHandling: {
            type: ["boolean"],
          },
          umdNamedDefine: {
            type: ["boolean"]
          }
        }]
      },
      resolve: {
        type: [{
          alias: {
            type: [
              {
                additionalProperties: {
                  type: ["string"]
                },
                type: ["object"]
              },
            ]
          },
          aliasFields: {
            type: ["array"],
          },
          cachePredicate: {
            type: ["function"],
          },
          cacheWithContext: {
            type: ["boolean"],
          },
          descriptionFiles: {
            type: ["array"],
          },
          enforceExtension: {
            type: ["boolean"],
          },
          enforceModuleExtension: {
            type: ["boolean"],
          },
          extensions: {
            type: ["array"],
          },
          fileSystem: [],
          mainFields: {
            type: ["array"],
          },
          mainFiles: {
            type: ["array"],
          },
          moduleExtensions: {
            type: ["array"],
          },
          modules: {
            type: ["array"],
          },
          plugins: {
            type: ["array"],
          },
          resolver: [],
          symlinks: {
            type: ["boolean"],
          },
          concord: {
            type: ["boolean"],
          },
          unsafeCache: {
            type: ["boolean", "object"],
          },
          useSyncFileSystemCalls: {
            type: ["boolean"]
          }
        }]
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
        type: [{
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
            type: [false, {
                type: [{
                  chunks: [
                          "initial",
                          "async",
                          "all",
                          "function"
                        ]
                      }
                    ],
                  minSize: {
                    type: ["number"],
                  },
                  minChunks: {
                    type: ["number"],
                  },
                  maxAsyncRequests: {
                    type: ["number"],
                  },
                  maxInitialRequests: {
                    type: ["number"],
                  },
                  name: {
                    type: [ "boolean","function","string"],
                  },
                  filename: {
                    type: ["string"],
                  },
                  automaticNameDelimiter: {
                    type: ["string"],
                  },
                  cacheGroups: {
                    type: [{
                      type: [false, "function", "string","regex", {
                          type: [{
                            test: {
                              type: [ "function", "string", "regex"],
                            },
                            chunks: [
                                    "initial",
                                    "async",
                                    "all",
                                    "function"
                            ],
                            enforce: {
                              type: ["boolean"],
                            },
                            priority: {
                              type: ["number"],
                            },
                            minSize: {
                              type: ["number"],
                            },
                            minChunks: {
                              type: ["number"],
                            },
                            maxAsyncRequests: {
                              type: ["number"],
                            },
                            maxInitialRequests: {
                              type: ["number"],
                            },
                            reuseExistingChunk: {
                              type: ["boolean"],
                            },
                            name: {
                              type: ["boolean","function", "string"],
                            },
                            filename: {
                              type: ["string"]
                            }
                          }]
                        }]
                    }]
          },
          runtimeChunk: ["boolean", "single","multiple",  {
            type: [{
              name: {
                type: [ "string", "function"]
              }
            }],
          noEmitOnErrors: {
            type: ["boolean"]
          },
          namedModules: {
            type: ["boolean"]
          },
          namedChunks: {
            type: ["boolean"],
          },
          portableRecords: {
            type: ["boolean"],
          },
          minimize: {
            type: ["boolean"],
          },
          minimizer: {
            type: ["array"],
          },
          nodeEnv: {
            type: [false, "string"]
          },
          parallelism: {
            type: ["number"],
          },
        }],
        performance: {
            type: [false,
          {
              assetFilter: ["function"],
              hints: [
                  false,
                  "warning",
                  "error"
              ],
              maxEntrypointSize: ["number"],
              maxAssetSize: ["number"]
            }],
        }
      }],
      plugins: {
        type: ["array"]
      },
      profile: {
        type: ["boolean"],
      },
      recordsInputPath: {
        type: ["string"],
      },
      recordsOutputPath: {
        type: ["string"],
      },
      recordsPath: {
        type: ["string"],
      },
      resolve: [],
      resolveLoader: [],
      serve: {
        type: ["object"],
      },
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
  