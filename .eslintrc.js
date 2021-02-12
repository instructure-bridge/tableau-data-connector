module.exports = {
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-tsdoc'
  ],
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
    rules: {
      'tsdoc/syntax': 'warn'
    },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
      ],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
      }
    }
  ]
};
