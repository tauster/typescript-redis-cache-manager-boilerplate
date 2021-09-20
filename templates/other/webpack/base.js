const path = require('path');
const webpack = require('webpack');
const { name, version } = require('../package.json');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'node',
    devtool: "source-map",
    entry: {
        other_core_name: path.resolve(__dirname, '../src/index.ts')
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            "@cache_manager/lib_to_import": path.resolve(__dirname, "../../../packages/lib_to_import/src"),
        }
    },
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                loaders: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // pass NODE_ENV along into webpack bundle
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                PACKAGE_NAME: JSON.stringify(name),
                PACKAGE_VERSION: JSON.stringify(version),
                AWS_SDK_LOAD_CONFIG: JSON.stringify(true)
            }
        }),
        new CopyWebpackPlugin(
            [
                { from: './src/assets/', to: './'}
            ],
            {debug: 'info', copyUnmodified: true}
        )
    ],
    externals: {
        'aws-sdk': 'aws-sdk',
    }
};