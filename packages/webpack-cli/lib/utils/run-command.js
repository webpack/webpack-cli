const execa = require('execa');
const logger = require('./logger');

async function runCommand(command, args = []) {
    try {
        await execa(command, args, { stdio: 'inherit', shell: true });
    } catch (error) {
        logger.error(error.message);
        process.exit(2);
    }
}

module.exports = runCommand;
