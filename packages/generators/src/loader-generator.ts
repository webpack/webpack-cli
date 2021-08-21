import path from "path";
import addonGenerator from "./addon-generator";
import { toKebabCase } from "./utils/helpers";

/**
 * Formats a string into webpack loader format
 * (eg: 'style-loader', 'raw-loader')
 *
 * @param {string} name A loader name to be formatted
 * @returns {string} The formatted string
 */
export function makeLoaderName(name: string): string {
  name = toKebabCase(name);

  if (!/loader$/.test(name)) {
    name += "-loader";
  }

  return name;
}

/**
 * A yeoman generator class for creating a webpack
 * loader project. It adds some starter loader code
 * and runs `webpack-defaults`.
 *
 * @class LoaderGenerator
 * @extends {Generator}
 */

export const LoaderGenerator = addonGenerator(
  [
    {
      default: "my-loader",
      filter: makeLoaderName,
      message: "Loader name",
      name: "name",
      type: "input",
      validate: (str: string): boolean => str.length > 0,
    },
  ],
  path.resolve(__dirname, "../loader-template"),
  (gen): Record<string, unknown> => ({ name: gen.props.name }),
);

export default LoaderGenerator;
