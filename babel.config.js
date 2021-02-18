// Config based on https://jestjs.io/docs/en/getting-started#using-babel
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
                useBuiltIns: 'entry',
                corejs: {
                    version: '3.8.3',
                },
            },
        ],
        '@babel/preset-typescript',
    ],
};
