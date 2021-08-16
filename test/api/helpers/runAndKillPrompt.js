const prompt = require("../../../packages/webpack-cli/lib/utils/prompt");

setTimeout(() => process.kill(process.pid, "SIGINT"), 1000);

prompt({
    message: "Would you like to install package 'test'? (Yes/No):",
    defaultResponse: "No",
    stream: process.stdout,
});
