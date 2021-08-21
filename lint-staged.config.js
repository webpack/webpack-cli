module.exports = {
  "*.{json,md,yml,css}": ["prettier --write"],
  "*.{js,ts}": ["eslint --fix", "prettier --write"],
};
