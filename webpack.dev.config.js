var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');
var DotEnvPlugin = require('dotenv-webpack');

module.exports = {
    entry: path.join(__dirname, 'src/app.ts'),
    output: {
        path: path.join(__dirname, 'www'),
        filename: 'game/main.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules'],
        alias: {
            assets: path.join(__dirname, 'assets/')
        }
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['node ./scripts/generateAssetsClass.js --dev']
        }),
        new CopyWebpackPlugin([{
            from: 'locales', to: 'locales'
        }]),
        new webpack.DefinePlugin({
            'DEBUG': true,
            'GAME_WIDTH': 435,
            'GAME_HEIGHT': 720
        }),
        new DotEnvPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'www'),
        filename: 'game/main.js',
        compress: true,
        port: 9000,
        inline: true,
        watchContentBase: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' }
        ]
    },
    devtool: 'source-map'
};
