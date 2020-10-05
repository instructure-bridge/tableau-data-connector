const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (configDirs) {
    var module = {
        entry: configDirs.srcPath + '/bridgeWDC.ts',
        devtool: 'inline-source-map',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'bundle.js',
            path: configDirs.distPath,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.svg$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    include: [configDirs.srcPath],
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Bridge API',
                filename: configDirs.distPath + '/index.html',
                template: configDirs.srcPath + '/index.ejs',
                favicon: configDirs.srcPath + '/favicon.ico',
                inject: 'head',
            }),
            new MiniCssExtractPlugin({ filename: 'styles.css' }),
            new CleanWebpackPlugin(),
        ],
    };
    return module;
};
