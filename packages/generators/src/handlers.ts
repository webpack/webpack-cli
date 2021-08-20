import * as defaultHandler from "./handlers/default";
import * as svelteHandler from "./handlers/svelte";

export default {
    default: defaultHandler,
    svelte: svelteHandler,
};
