import { prompt } from 'enquirer';
import { green } from 'colorette';
import { runCommand } from './run-command';
import { getPackageManager } from './get-package-manager';
import { packageExists } from './package-exists';

/**
 *
 * @param packageName
 * @param preMessage Message to show before the question
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function promptInstallation(packageName: string, preMessage?: Function) {
    const packageManager = getPackageManager();
    const options = [packageManager === 'yarn' ? 'add' : 'install', '-D', packageName];

    const commandToBeRun = `${packageManager} ${options.join(' ')}`;
    if (preMessage) {
        preMessage();
    }
    const question = `Would you like to install ${packageName}? (That will run ${green(commandToBeRun)})`;
    const { installConfirm } = await prompt([
        {
            type: 'confirm',
            name: 'installConfirm',
            message: question,
            initial: 'Y',
        },
    ]);
    if (installConfirm) {
        await runCommand(commandToBeRun);
        return packageExists(packageName);
    }
    // eslint-disable-next-line require-atomic-updates
    process.exitCode = 2;
}
