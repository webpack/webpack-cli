const { isDevServer4 } = require('../../utils/test-utils');

module.exports = {
    mode: 'development',
    infrastructureLogging: {
        level: 'log',
    },
    devServer: isDevServer4
        ? {
              client: {
                  logging: 'info',
              },
          }
        : {},
};
