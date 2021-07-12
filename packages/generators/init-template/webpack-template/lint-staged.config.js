module.exports = {
  '*.js': ['eslint --fix', 'prettier --write', 'git add'],
  '*.{json,md,yml,css,ts}': ['git add', 'prettier --write'],
};
