module.exports = [
  {
    name: "login",
    mode: "development",
    entry: "./src/login.js",
    output: { filename: "login.js", publicPath: "/login/" },
    devServer: {},
  },
  {
    name: "admin",
    mode: "development",
    entry: "./src/admin.js",
    output: { filename: "admin.js", publicPath: "/admin/" },
  },
];
