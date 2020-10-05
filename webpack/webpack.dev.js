module.exports = function (configDirs) {
    var module = {
        mode: 'development',
        devServer: {
            clientLogLevel: 'debug',
            contentBase: [configDirs.distPath, 'node_modules/webdataconnector'],
            compress: true,
            disableHostCheck: true,
            port: 8888,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'false',
                'Access-Control-Allow-Headers':
                    'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
                'Access-Control-Allow-Methods': 'GET',
            },
            // Proxy to get around CORS errors when using the tableua simulator
            proxy: {
                '/api': {
                    logLevel: 'debug',
                    changeOrigin: true,
                    target: 'http://localhost:8888', // Default target is required, see https://webpack.js.org/configuration/dev-server/#devserverproxy
                    router: function (req) {
                        if (
                            req.headers['X-Forwarded-Host'] ||
                            req.headers['x-forwarded-host']
                        ) {
                            const proto =
                                req.headers['X-Forwarded-Proto'] ||
                                req.headers['x-forwarded-proto'];
                            return {
                                protocol: proto.includes(':')
                                    ? proto
                                    : proto + ':',
                                host:
                                    req.headers['X-Forwarded-Host'] ||
                                    req.headers['x-forwarded-host'],
                                port:
                                    req.headers['X-Forwarded-Port'] ||
                                    req.headers['x-forwarded-port'],
                            };
                        }
                    },
                },
            },
        },
    };
    return module;
};
