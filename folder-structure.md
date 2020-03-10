# Folder Structue

```
├───webpack-cli
│   ├───.github                                  ## Contains files required by Github for proper workflow
│   │   ├───ISSUE_TEMPLATE
│   │   ├───workflows
│   ├───docs                                     ## Documents explaining Webpack Functions
│   │   ├───assets
│   │   │   ├───css
│   │   │   ├───images
│   │   │   ├───js
│   │   ├───classes
│   │   ├───enums
│   │   ├───interfaces
│   │   ├───modules
│   ├───packages                                 ## Contains webpack-cli packages
│   │   ├───generate-loader                      ## This contains the logic to initiate new loader projects
│   │   │   ├───examples
│   │   │   │   ├───simple
│   │   │   │   │   ├───src
│   │   │   ├───src
│   │   │   ├───templates
│   │   │   │   ├───examples
│   │   │   │   │   ├───simple
│   │   │   │   │   │   ├───src
│   │   │   │   ├───src
│   │   │   │   ├───test
│   │   │   │   │   ├───fixtures
│   │   │   ├───test
│   │   │   │   ├───fixtures
│   │   ├───generate-plugin                      ## This contains the logic to initiate new plugin projects
│   │   │   ├───examples
│   │   │   │   ├───simple
│   │   │   │   │   ├───src
│   │   │   ├───src
│   │   │   ├───templates
│   │   │   │   ├───examples
│   │   │   │   │   ├───simple
│   │   │   │   │   │   ├───src
│   │   │   │   ├───src
│   │   │   │   ├───test
│   │   │   │   │   ├───fixtures
│   │   │   ├───test
│   │   │   │   ├───fixtures
│   │   ├───generators                           ## This contains all webpack-cli related yeoman generators
│   │   │   ├───src
│   │   │   │   ├───types
│   │   │   │   ├───utils
│   │   │   ├───templates
│   │   │   ├───__tests__
│   │   ├───info                                 ## This returns a set of information related to the local environment
│   │   │   ├───src
│   │   │   ├───__tests__
│   │   ├───init                                 ## This contains the logic to create a new webpack configuration
│   │   │   ├───src
│   │   │   │   ├───types
│   │   ├───logger                               ## webpack CLI logger
│   │   │   ├───src
│   │   ├───migrate                              ## This contains the logic to migrate a project from one version to the other
│   │   │   ├───src
│   │   │   │   ├───bannerPlugin
│   │   │   │   ├───commonsChunkPlugin
│   │   │   │   ├───extractTextPlugin
│   │   │   │   ├───loaderOptionsPlugin
│   │   │   │   ├───loaders
│   │   │   │   ├───moduleConcatenationPlugin
│   │   │   │   ├───namedModulesPlugin
│   │   │   │   ├───noEmitOnErrorsPlugin
│   │   │   │   ├───outputPath
│   │   │   │   ├───removeDeprecatedPlugins
│   │   │   │   ├───removeJsonLoader
│   │   │   │   ├───resolve
│   │   │   │   ├───types
│   │   │   │   ├───uglifyJsPlugin
│   │   │   ├───__testfixtures__
│   │   │   ├───__tests__
│   │   │   │   ├───bannerPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───commonsChunkPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───extractTextPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───loaderOptionsPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───loaders
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───moduleConcatenationPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───namedModulesPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───noEmitOnErrorsPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───outputPath
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───removeDeprecatedPlugins
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───removeJsonLoader
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───resolve
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───uglifyJsPlugin
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───__snapshots__
│   │   ├───package-utils                        ## To manage packages and modules
│   │   │   ├───src
│   │   │   ├───__tests__
│   │   ├───serve                                ## This contains the logic to run webpack-dev-server and provide live reloading
│   │   │   ├───src
│   │   │   ├───__tests__
│   │   ├───utils                                ## This contains the utilities used across the webpack-cli repositories
│   │   │   ├───src
│   │   │   │   ├───types
│   │   │   ├───__tests__
│   │   │   │   ├───recursive-parser
│   │   │   │   │   ├───__snapshots__
│   │   │   │   │   ├───__testfixtures__
│   │   │   │   ├───__snapshots__
│   │   ├───webpack-cli
│   │   │   ├───__tests__
│   │   ├───webpack-scaffold                     ## It contains utility functions to help you work with Inquirer prompting and scaffolding
│   │   │   ├───src
│   │   │   ├───__tests__
│   │   │   │   ├───__snapshots__
│   ├───scripts
│   ├───smoketests                               ## It contains minimal set of tests run on each build
│   │   ├───watch
│   ├───test
│   │   ├───config
│   │   │   ├───basic
│   │   │   │   ├───binary
│   │   │   ├───empty
│   │   │   ├───type
│   │   │   │   ├───array
│   │   │   │   │   ├───dist
│   │   │   │   ├───function
│   │   │   │   │   ├───binary
│   │   │   │   ├───promise
│   │   ├───config-lookup
│   │   │   ├───dotfolder-array
│   │   │   │   ├───.webpack
│   │   │   ├───dotfolder-single
│   │   │   │   ├───.webpack
│   │   ├───defaults
│   │   │   ├───binary
│   │   │   ├───dist
│   │   │   ├───with-config-and-entry
│   │   │   ├───without-config-and-entry
│   │   ├───entry
│   │   │   ├───defaults-empty
│   │   │   ├───defaults-index
│   │   │   ├───scss
│   │   ├───env
│   │   │   ├───array
│   │   │   ├───object
│   │   │   ├───prod
│   │   ├───global
│   │   ├───help
│   │   ├───info
│   │   ├───json
│   │   ├───merge
│   │   │   ├───config
│   │   │   │   ├───dist
│   │   │   ├───defaults
│   │   │   │   ├───dist
│   │   ├───mode
│   │   │   ├───dev
│   │   │   │   ├───src
│   │   │   ├───prod
│   │   │   │   ├───src
│   │   ├───no-mode
│   │   │   ├───src
│   │   ├───node
│   │   ├───output
│   │   │   ├───named-bundles
│   │   │   │   ├───binary
│   │   │   │   ├───dist
│   │   │   ├───pretty
│   │   │   │   ├───src
│   │   ├───serve
│   │   ├───source-map
│   │   │   ├───array
│   │   │   │   ├───binary
│   │   │   │   ├───dist
│   │   │   ├───object
│   │   │   │   ├───binary
│   │   │   │   ├───dist
│   │   ├───standard
│   │   │   ├───src
│   │   ├───target
│   │   │   ├───node
│   │   ├───typescript
│   │   ├───unknown
│   │   ├───utils
│   │   ├───version
```