'use strict';

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 80],
        'scope-case': [2, 'always', 'lowerCase'],
        'scope-empty': [0, 'never'],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [0, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lowerCase'],
        'scope-enum': [0, 'never'],
        'type-empty': [2, 'never'],
        'type-enum': [2, 'always', ['ast', 'break', 'chore', 'cli', 'docs', 'feat', 'fix', 'misc', 'tests', 'refactor']],
    },
};
