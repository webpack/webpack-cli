module.exports = (isUsingDevServer) => {
  const scripts = {
    build: "webpack --mode=production --node-env=production",
    "build:dev": "webpack --mode=development",
    "build:prod": "webpack --mode=production --node-env=production",
    watch: "webpack --watch",
  };
  if (isUsingDevServer) {
    scripts.serve = "webpack serve";
  }

  return {
    version: "1.0.0",
    description: "My webpack project",
    name: "my-webpack-project",
    scripts,
  };
};
