module.exports = {
    root: true,
    reportUnusedDisableDirectives: true,
    extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended', 'prettier'],
    parserOptions: { ecmaVersion: 2018, sourceType: 'script' },
    plugins: ['node'],
    settings: {
        node: {
            allowModules: ['@webpack-cli/generators', '@webpack-cli/webpack-scaffold', '@webpack-cli/utils'],
        },
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    rules: {
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
        'no-process-exit': 'off',
        'no-template-curly-in-string': 'error',
        'no-caller': 'error',
        'no-extra-bind': 'error',
        'no-loop-func': 'error',
    },
    overrides: [
        {
            settings: {
                node: {
                    tryExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
            },
            files: ['**/*.ts'],
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier/@typescript-eslint',
            ],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            rules: {
                'node/no-unsupported-features/es-syntax': 'off',
            },
        },
    ],
};
