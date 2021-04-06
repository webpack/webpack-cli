const prompt = ({ message, defaultResponse, stdout }) => {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: stdout,
    });

    return new Promise((resolve) => {
        rl.question(message, function (answer) {
            // close the stream
            rl.close();
            // resolve with the input response
            if (['y', 'yes'].includes((answer || defaultResponse).toLowerCase())) resolve(true);
            resolve(false);
        });
    });
};

module.exports = prompt;
