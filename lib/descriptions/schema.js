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
    mode: [
      "development",
      "production",
      "none"
    ],
    amd: [],
    bail: ["boolean"],
    cache: ["boolean", "object"],
      context: ["string"],
      devtool: ["string", false],
      loader: ["object"],
      name: ["string"],
  
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
      stats: [],
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
      watchOptions: ['object']
}