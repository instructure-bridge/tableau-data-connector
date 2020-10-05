const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (configDirs) {
    var module = {
        mode: 'development', // Load development defaults
        output: {
            filename: 'bundle.js',
            path: configDirs.srcPath + '/__tests__/test-dist',
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Bridge API',
                filename:
                    configDirs.srcPath + '/__tests__/test-dist/index.html',
                template: configDirs.srcPath + '/index.ejs',
                inject: 'head',
            }),
        ],
    };
    return module;
};
