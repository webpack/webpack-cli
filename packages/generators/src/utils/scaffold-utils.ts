import Generator from "yeoman-generator";

type CustomGeneratorStringPrompt = { [x: string]: string } | Promise<{ [x: string]: string }>;
type CustomGeneratorBoolPrompt = { [x: string]: boolean } | Promise<{ [x: string]: boolean }>;

export function List(
  self: Generator,
  name: string,
  message: string,
  choices: string[],
  defaultChoice: string,
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
  defaultChoice: string,
  skip = false,
): CustomGeneratorStringPrompt {
  if (skip) {
    return { [name]: defaultChoice };
  }

  return self.prompt([{ default: defaultChoice, message, name, type: "input" }]);
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
