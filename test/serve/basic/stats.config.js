const { isDevServer4 } = require('../../utils/test-utils');

module.exports = {
    mode: 'development',
    devtool: false,
    devServer: isDevServer4
        ? {
              devMiddleware: {
                  stats: 'minimal',
              },
          }
        : {
              stats: 'minimal',
          },
};
