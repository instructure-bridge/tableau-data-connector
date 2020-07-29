module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 11,
    },
    ignorePatterns: ['**/src/__tests__/test-dist/**', '**/dist/**'],
    rules: {},
};
