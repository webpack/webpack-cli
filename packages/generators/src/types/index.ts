import type Generator from "yeoman-generator";
import { type IWebpackCLI } from "webpack-cli";

export type InitOptions = { template: string; force?: boolean };
export type LoaderOptions = { template: string };
export type PluginOptions = { template: string };

export type InitGeneratorOptions = { generationPath: string } & InitOptions;
export type LoaderGeneratorOptions = { generationPath: string } & LoaderOptions;
export type PluginGeneratorOptions = { generationPath: string } & PluginOptions;

export type BaseCustomGeneratorOptions = {
  template: string;
  generationPath: string;
  force?: boolean;
};
export type CustomGeneratorOptions<T extends BaseCustomGeneratorOptions> =
  Generator.GeneratorOptions & {
    cli: IWebpackCLI;
    options: T;
  };
