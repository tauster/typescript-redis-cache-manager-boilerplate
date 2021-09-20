const path = require('path');
const webpack = require('webpack');
const { name, version } = require('../package.json');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'node',
    devtool: "source-map",
    entry: {
        rest_db_action: path.resolve(__dirname, '../src/index.ts')
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            "@cache_manager/lib_api": path.resolve(__dirname, "../../packages/lib_api/src"),
            "@cache_manager/lib_cache": path.resolve(__dirname, "../../packages/lib_cache/src"),
            "@cache_manager/lib_common_utilities": path.resolve(__dirname, "../../packages/lib_common_utilities/src"),
            "@cache_manager/lib_database": path.resolve(__dirname, "../../packages/lib_database/src"),
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
                FORCE_DEBUG_LOG: JSON.stringify(process.env.FORCE_DEBUG_LOG),
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
        'aws-lambda': 'aws-lambda',
        'pg-native': 'pg-native'
    },
    stats: {
        warningsFilter: warning => {

            // placeholder of whether to filter this warning
            let filterWarning = false;

            // whether this warning is any of the following non-important warnings to be filtered
            if (RegExp("node_modules/express/lib/view.js").test(warning) == true ||
                RegExp("node_modules/websocket/lib/BufferUtil.js").test(warning) == true ||
                RegExp("node_modules/websocket/lib/Validation.js").test(warning) == true) {
                filterWarning = true;
            }

            // return the filter warning status
            return filterWarning;
        }
    }
};