import readline from 'readline';

const prompt = ({ message, defaultResponse, stream }) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: stream,
    });

    return new Promise((resolve) => {
        rl.question(`${message} `, (answer) => {
            // Close the stream
            rl.close();

            const response = (answer || defaultResponse).toLowerCase();

            // Resolve with the input response
            if (response === 'y' || response === 'yes') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

export default prompt;
