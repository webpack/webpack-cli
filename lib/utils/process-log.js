process.on("uncaughtException", error => {
	process.cliLogger.error(`Uncaught exception: ${error}`);
	if (error && error.stack) process.cliLogger.error(error.stack);
	process.exit(1);
});

process.on("unhandledRejection", error => {
	process.cliLogger.error(`Promise rejection: ${error}`);
	if (error && error.stack) process.cliLogger.error(error.stack);
	process.exit(1);
});

//TODO: implement nologger for debug