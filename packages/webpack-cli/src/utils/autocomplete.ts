import * as Fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const omelette = require("omelette");

const appName = "webpack-cli";
const autocompleteTree = {
  build: [
    {
      long: "--config",
    },
    {
      long: "--stats",
    },
  ],
} as IAutocompleteTree;

function getAutoCompleteObject() {
  return omelette(appName);
}

export function executeAutoComplete() {
  const autoCompleteObject = getAutoCompleteObject();
  autoCompleteObject.on(
    "complete",
    function (
      fragment: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { before: string; fragment: number; line: string; reply: (answer: any) => void },
    ) {
      const line = data.line;
      const reply = data.reply;
      const argsLine = line.substring(appName.length);
      const args = argsLine.match(/\S+/g) || [];
      const lineEndsWithWhitespaceChar = /\s{1}/.test(last(line));

      const getReply = getReplyHandler(lineEndsWithWhitespaceChar);

      reply(getReply(args, autocompleteTree));
    },
  );

  autoCompleteObject.init();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupAutoCompleteForShell(path?: string, shell?: string): any {
  const autoCompleteObject = getAutoCompleteObject();
  let initFile = path;

  if (shell) {
    autoCompleteObject.shell = shell;
  } else {
    autoCompleteObject.shell = autoCompleteObject.getActiveShell();
  }

  if (!initFile) {
    initFile = autoCompleteObject.getDefaultShellInitFile();
  }

  let initFileContent;

  try {
    initFileContent = Fs.readFileSync(initFile as string, { encoding: "utf-8" });
  } catch (exception) {
    throw `Can't read init file (${initFile}): ${exception}`;
  }

  try {
    // For bash we need to enable bash_completion before webpack cli completion
    if (
      autoCompleteObject.shell === "bash" &&
      initFileContent.indexOf("begin bash_completion configuration") === -1
    ) {
      const sources = `[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
[ -f /usr/share/bash-completion/bash_completion ] && . /usr/share/bash-completion/bash_completion
[ -f /etc/bash_completion ] && . /etc/bash_completion`;

      const template = `
# begin bash_completion configuration for ${appName} completion
${sources}
# end bash_completion configuration for ${appName} completion
`;

      Fs.appendFileSync(initFile as string, template);
    }

    if (initFileContent.indexOf(`begin ${appName} completion`) === -1) {
      autoCompleteObject.setupShellInitFile(initFile);
    }
  } catch (exception) {
    throw `Can't setup autocomplete. Please make sure that init file (${initFile}) exist and you have write permissions: ${exception}`;
  }
}

function getReplyHandler(
  lineEndsWithWhitespaceChar: boolean,
): (args: string[], autocompleteTree: IAutocompleteTree) => string[] {
  return function getReply(args: string[], autocompleteTree: IAutocompleteTree): string[] {
    const currentArg = head(args);
    const commandsAndCategories = Object.keys(autocompleteTree);

    if (currentArg === undefined) {
      // no more args - show all of the items at the current level
      return commandsAndCategories;
    } else {
      // check what arg points to
      const entity = autocompleteTree[currentArg];
      if (entity) {
        // arg points to an existing command or category
        const restOfArgs = tail(args);
        if (restOfArgs.length || lineEndsWithWhitespaceChar) {
          if (entity instanceof Array) {
            // it is command
            const getCommandReply = getCommandReplyHandler(lineEndsWithWhitespaceChar);
            return getCommandReply(restOfArgs, entity);
          } else {
            // it is category
            return getReply(restOfArgs, entity);
          }
        } else {
          // if last arg has no trailing whitespace, it should be added
          return [currentArg];
        }
      } else {
        // arg points to nothing specific - return commands and categories which start with arg
        return commandsAndCategories.filter((commandOrCategory) =>
          commandOrCategory.startsWith(currentArg),
        );
      }
    }
  };
}

function getCommandReplyHandler(
  lineEndsWithWhitespaceChar: boolean,
): (args: string[], optionNames: IOptionNames[]) => string[] {
  return function getCommandReply(args: string[], optionsNames: IOptionNames[]): string[] {
    const currentArg = head(args);
    if (currentArg === undefined) {
      // no more args, returning remaining optionsNames
      return optionsNames.map((option) => (option.long as string) || (option.short as string));
    } else {
      const restOfArgs = tail(args);
      if (restOfArgs.length || lineEndsWithWhitespaceChar) {
        const filteredOptions = optionsNames.filter(
          (option) => option.long !== currentArg && option.short !== currentArg,
        );
        return getCommandReply(restOfArgs, filteredOptions);
      } else {
        const candidates: string[] = [];
        for (const option of optionsNames) {
          if (option.long && option.long.startsWith(currentArg)) {
            candidates.push(option.long);
          } else if (option.short && option.short.startsWith(currentArg)) {
            candidates.push(option.short);
          }
        }
        return candidates;
      }
    }
  };
}

interface IOptionNames {
  short?: string;
  long?: string;
}

interface IAutocompleteTree {
  [entity: string]: IAutocompleteTree | IOptionNames[];
}

// utility functions (to avoid loading lodash for performance reasons)

function last(line: string): string {
  return line.substr(-1, 1);
}

function head<T>(array: T[]): T {
  return array[0];
}

function tail<T>(array: T[]): T[] {
  return array.slice(1);
}
