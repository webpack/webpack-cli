module.exports = {
  "*": ["prettier --write --ignore-unknown"],
  "*.{js,ts}": ["eslint --fix"],
};
