const logger = require('./logger');

function logErrorAndExit(error) {
    if (error && error.stack) logger.error(error.stack);
    process.exit(error.exitCode);
}

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught exception: ${error}`);
    logErrorAndExit(error);
});

process.on('unhandledRejection', (error) => {
    logger.error(`Promise rejection: ${error}`);
    logErrorAndExit(error);
});

//TODO: implement logger for debug
