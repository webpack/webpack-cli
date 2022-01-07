import path from "path";
import addonGenerator from "./addon-generator";
import { toKebabCase, toUpperCamelCase } from "./utils/helpers";

export const PluginGenerator = addonGenerator(
  [
    {
      default: "my-webpack-plugin",
      filter: toKebabCase,
      message: "Plugin name",
      name: "name",
      type: "input",
      validate: (str: string): boolean => str.length > 0,
    },
  ],
  path.resolve(__dirname, "../plugin-template"),
  (gen): Record<string, unknown> => ({
    name: toUpperCamelCase(gen.props.name),
  }),
);

export default PluginGenerator;
