import path from "path";
import addonGenerator from "./addon-generator";
import { toKebabCase, toUpperCamelCase } from "./utils/helpers";
import type { PluginGeneratorOptions } from "./types";
import Generator from "yeoman-generator";

export const PluginGenerator = addonGenerator<PluginGeneratorOptions>(
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
    name: toUpperCamelCase((gen.props as Generator.Question).name as string),
  }),
);

export default PluginGenerator;
