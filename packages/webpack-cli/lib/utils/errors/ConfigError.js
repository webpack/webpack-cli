class ConfigError extends Error {
    constructor(message, name) {
        super(message);
        this.name = name || 'ConfigError';
        // No need to show stack trace for known errors
        this.stack = '';
        process.exitCode = 2;
    }
}

module.exports = ConfigError;
