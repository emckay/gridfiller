const webpack = require('webpack');
const path = require('path');

const jsonImporter = require('node-sass-json-importer');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        'material-design-icons',
        './src/index.js',
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'react-hot!babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap'],
            },
            {
                test: /\.less$/,
                loader: 'style!css!less',
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|svg|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
        ],
    },
    sassLoader: {
        importer: jsonImporter,
    },
    devServer: {
        contentBase: './build',
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
};
