export interface Command {
    name: string,
    alias: string,
    scope: string,
    type: any,
    description: string
}

export interface CoreCommand {
    type: any,
    multiple: boolean,
    defaultValue?: boolean,
    defaultOption?: boolean,
    group: string,
    description: string,
}
