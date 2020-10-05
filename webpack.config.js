const path = require('path');
const { mergeWithCustomize, merge, unique } = require('webpack-merge');

const configDirs = {
    srcPath: path.resolve(__dirname, 'src'),
    distPath: path.resolve(__dirname, 'dist'),
    confPath: path.resolve(__dirname, 'webpack'),
};

const commonConfig = require(configDirs.confPath + '/webpack.common.js')(
    configDirs,
);
const productionConfig = require(configDirs.confPath + '/webpack.prod.js')(
    configDirs,
);
const developmentConfig = require(configDirs.confPath + '/webpack.dev.js')(
    configDirs,
);
const testConfig = require(configDirs.confPath + '/webpack.test.js')(
    configDirs,
);

module.exports = (target) => {
    const t = target ? target : process.env.NODE_ENV;
    switch (t) {
        case 'development':
            return merge(commonConfig, developmentConfig);
        case 'production':
            return merge(commonConfig, productionConfig);
        case 'test':
            return mergeWithCustomize({
                customizeArray: unique(
                    'plugins',
                    [
                        'HtmlWebpackPlugin',
                        'MiniCssExtractPlugin',
                        'CleanWebpackPlugin',
                    ],
                    (plugin) => plugin.constructor && plugin.constructor.name,
                ),
            })(commonConfig, testConfig);
        default:
            return merge(commonConfig, developmentConfig);
    }
};
