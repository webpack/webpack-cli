const logger = require('./logger');

process.on('uncaughtException', error => {
    logger.error(`Uncaught exception: ${error}`);
    logErrorAndExit(error);
});

process.on('unhandledRejection', error => {
    logger.error(`Promise rejection: ${error}`);
    logErrorAndExit(error);
});

function logErrorAndExit(error) {
    if (error && error.stack) logger.error(error.stack);
    process.exit(1);
}

//TODO: implement nologger for debug
