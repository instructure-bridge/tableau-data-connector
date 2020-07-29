module.exports = function (configDirs) {
  var module = {
    mode: 'development',
    devServer: {
      contentBase: configDirs.distPath,
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
    },
  };
  return module;
};
