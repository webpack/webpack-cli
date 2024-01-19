module.exports = {
  "*": ["prettier --write --ignore-unknown", "cspell --cache --no-must-find-files"],
  "*.{js,ts}": ["eslint --cache --fix"],
};
