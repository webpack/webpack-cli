class MergeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MergeError';
        // No need to show stack trace for known errors
        this.stack = '';
    }
}

module.exports = MergeError;
