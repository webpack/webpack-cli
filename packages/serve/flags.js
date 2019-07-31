const CONFIG_GROUP = 'Config options:';
const ADVANCED_GROUP = 'Advanced options:';
const DISPLAY_GROUP = 'Stats options:';
const SSL_GROUP = 'SSL options:';
const CONNECTION_GROUP = 'Connection options:';
const RESPONSE_GROUP = 'Response options:';
const BASIC_GROUP = 'Basic options:';

module.exports = {
    core: [
        {
            name: 'inline',
            type: Boolean,
            defaultValue: true,
            description: 'inline',
        },
    ],
};
