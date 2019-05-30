import { WebpackOptions } from '../types';

export function getDefaultOptimization(isProd: boolean): WebpackOptions["optimization"] {
    let optimizationOptions;
    if (isProd) {
        optimizationOptions = {
            splitChunks: {
                chunks: "'all'",
            },
        };
    } else {
        optimizationOptions = {
            minimizer: [
                "new TerserPlugin()",
            ],
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        priority: -10,
                        test: "/[\\\\/]node_modules[\\\\/]/",
                    },
                },
                chunks: "'async'",
                minChunks: 1,
                minSize: 30000,
                name: !this.isProd,
            },
        };
    }
    return optimizationOptions;
}