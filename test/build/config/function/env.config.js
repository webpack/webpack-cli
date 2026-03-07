module.exports = function configuration(env) {
  const configName = env.name;
  return {
    name: configName,
    mode: "development",
    output: {
      filename: `./${configName}-single.js`,
    },
  };
};
