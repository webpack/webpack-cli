enum Groups {
    CONFIG_GROUP = 'Config options:',
    ADVANCED_GROUP = 'Advanced options:',
    DISPLAY_GROUP = 'Stats options:',
    SSL_GROUP = 'SSL options:',
    CONNECTION_GROUP = 'Connection options:',
    RESPONSE_GROUP = 'Response options:',
    BASIC_GROUP = 'Basic options:',
}

export interface DevServerFlag {
    name: string;
    type: any;
    defaultValue?: string | boolean;
    describe: string;
    multiple?: boolean;
    group?: Groups;
}
