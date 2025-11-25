const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        'tsichart-core': './src/index.ts',
        'dev-test': './src/dev-test.ts'
    },
    output: {
        path: path.resolve(__dirname, './dev-dist'),
        filename: '[name].js',
        clean: true,
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    optimization: {
        minimize: false,
        splitChunks: false  // Disable code splitting for simpler setup
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.css']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, './tsconfig.json'),
                        transpileOnly: false
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './dev-test.html',
            filename: 'index.html',
            chunks: ['tsichart-core', 'dev-test']
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        // Custom plugin to add UMD wrapper only to tsichart-core bundle
        {
            apply: (compiler) => {
                compiler.hooks.emit.tapAsync('UMDWrapper', (compilation, callback) => {
                    const asset = compilation.assets['tsichart-core.js'];
                    if (asset) {
                        const source = asset.source();
                        const umdWrapper = `
(function (root, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        (root = typeof globalThis !== 'undefined' ? globalThis : root || self, root.TsiClient = factory());
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    ${source}
    if (typeof __webpack_exports__ !== 'undefined' && __webpack_exports__.default) {
        return __webpack_exports__.default;
    }
    return __webpack_exports__;
}));`;
                        compilation.assets['tsichart-core.js'] = {
                            source: () => umdWrapper,
                            size: () => umdWrapper.length
                        };
                    }
                    callback();
                });
            }
        }
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, './'),
        },
        port: 8080,
        hot: true,
        open: true,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: false
        }
    },
    externals: {
        'd3': 'd3',
        'moment': 'moment'
    }
};
