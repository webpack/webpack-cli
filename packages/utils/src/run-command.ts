import execa from 'execa';

export async function runCommand(command, args = []): Promise<void> {
    try {
        await execa(command, args, {
            stdio: 'inherit',
            shell: true,
        });
    } catch (e) {
        throw new Error(e);
    }
}
