import * as defaultHandler from "./handlers/default";
import * as webpackHandler from "./handlers/webpack-defaults";

export default {
    default: defaultHandler,
    webpack: webpackHandler,
};
