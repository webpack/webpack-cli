import Generator from "yeoman-generator";

type CustomGeneratorStringPrompt = { [x: string]: string } | Promise<{ [x: string]: string }>;
type CustomGeneratorBoolPrompt = { [x: string]: boolean } | Promise<{ [x: string]: boolean }>;

/* eslint-disable @typescript-eslint/no-explicit-any */

export function List(
    self: Generator,
    name: string,
    message: string,
    choices: string[],
    defaultChoice?: string,
    skip = false,
): CustomGeneratorStringPrompt {
    if (skip) {
        return { [name]: defaultChoice };
    }

    return self.prompt([{ choices, message, name, type: "list", default: defaultChoice }]);
}

export function Input(
    self: Generator,
    name: string,
    message: string,
    defaultChoice?: string,
    skip = false,
): CustomGeneratorStringPrompt {
    if (skip) {
        return { [name]: defaultChoice };
    }

    return self.prompt([{ default: defaultChoice, message, name, type: "input" }]);
}

export function InputValidate(
    self: Generator,
    name: string,
    message: string,
    cb?: (input: string) => string | boolean,
    defaultChoice?: string,
    skip = false,
): Record<string, unknown> | any {
    if (skip) {
        return { [name]: defaultChoice };
    }

    const input: Generator.Question = {
        message,
        name,
        type: "input",
        validate: cb,
    };

    if (defaultChoice) {
        input.default = defaultChoice;
    }

    return self.prompt([input]);
}

export function Confirm(
    self: Generator,
    name: string,
    message: string,
    defaultChoice = true,
    skip = false,
): CustomGeneratorBoolPrompt {
    if (skip) {
        return { [name]: defaultChoice };
    }

    return self.prompt([{ default: defaultChoice, message, name, type: "confirm" }]);
}
