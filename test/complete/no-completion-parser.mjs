// Makes `@bomb.sh/tab` unresolvable, so the CLI takes its missing-package path.
import { register } from "node:module";

register(
  `data:text/javascript,${encodeURIComponent(`
    export async function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith("@bomb.sh/tab")) {
        const error = new Error("Cannot find package '" + specifier + "'");

        error.code = "ERR_MODULE_NOT_FOUND";

        throw error;
      }

      return nextResolve(specifier, context);
    }
  `)}`,
);
