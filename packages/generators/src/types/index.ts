import Generator from "yeoman-generator";
import path from "path";
import { IWebpackCLI } from "webpack-cli";

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

export class CustomGenerator<
  T extends BaseCustomGeneratorOptions = BaseCustomGeneratorOptions,
  Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>,
> extends Generator<Z> {
  public cli: IWebpackCLI;
  public template: string;
  public dependencies: string[];
  public force: boolean;
  public answers: Record<string, unknown>;
  public generationPath: string;
  public supportedTemplates: string[];
  public packageManager: string | undefined;

  public constructor(args: string | string[], opts: Z) {
    super(args, opts);

    this.cli = opts.cli;
    this.dependencies = [];
    this.answers = {};
    this.supportedTemplates = [];

    const { options } = opts;

    this.template = options.template;
    this.force = typeof options.force !== "undefined" ? options.force : false;
    this.generationPath = path.resolve(process.cwd(), options.generationPath);
  }
}
