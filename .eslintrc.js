module.exports = {
    root: true,
    extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended', 'prettier'],
    parserOptions: { ecmaVersion: 2018, sourceType: 'module' },
    plugins: ['node'],
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    rules: {
        'no-template-curly-in-string': 'error',
    },
    overrides: [
        {
            files: ['**/*.ts'],
            settings: {
                node: {
                    tryExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
            },
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier/@typescript-eslint',
            ],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint', 'prettier'],
            rules: {
                'node/no-unsupported-features/es-syntax': 'off',
            },
        },
        {
            files: ['**/*.js'],
            rules: {
                quotes: ['error', 'single'],
                'no-process-exit': 'off',
                'no-caller': 'error',
                'no-extra-bind': 'error',
                'no-loop-func': 'error',
                'valid-jsdoc': 'error',
            },
        },
    ],
};
