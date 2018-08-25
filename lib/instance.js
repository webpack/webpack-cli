const webpack = require('webpack');

module.exports = function webpackInstance(result, webpackOptions) {  
      if(result.processingErrors.length > 0) {
        throw new Error(result.processingErrors);
      }
      
      process.exit(0)
      const compiler = webpack(webpackOptions);
      compiler.run(() => {});
    return null;
}