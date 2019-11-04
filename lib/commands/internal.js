const logger = require('../utils/logger');

class InternalCommand {
    /**
     *
     * @param {String} command
     * @param {any} args
     */
    constructor(command, ...args) {
        /**
         *
         * @type {String}
         */
        this.command = command;
        /**
         *
         * @type {any[]}
         */
        this.args = args;
    }
    interactive() {}
    make() {}
    help() {
        const HelpGroup = require('../groups/help');
        const HelpOutput = new HelpGroup().run();
        logger.info(HelpOutput.outputOptions.help);
    }
    version() {
        const jsonPath = require('path').join(process.cwd(), 'package.json');
        const version = require(jsonPath).version;
        logger.info(`webpack-cli ${version}`);
    }
}

module.exports = InternalCommand;
