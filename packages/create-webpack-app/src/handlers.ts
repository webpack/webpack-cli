import * as defaultHandler from "./handlers/default";

export default {
  default: defaultHandler,
} as Record<string, typeof defaultHandler>;
