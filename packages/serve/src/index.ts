// Test dev-server availability before importing it
try {
    // eslint-disable-next-line node/no-extraneous-require
    require.resolve('webpack-dev-server');
} catch (error) {
    throw new Error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${error}`);
}

import serve from './serve';
export default serve;
