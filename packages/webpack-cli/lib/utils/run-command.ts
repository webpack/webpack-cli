import execa from 'execa';
import utils from './index';

async function runCommand(command: string, args = []) {
    try {
        await execa(command, args, { stdio: 'inherit', shell: true });
    } catch (error) {
        utils.logger.error(error.message);
        process.exit(2);
    }
}

export default runCommand;
