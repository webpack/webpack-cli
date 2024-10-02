import Generator from "yeoman-generator";
import { type IWebpackCLI } from "webpack-cli";
import path from "path";
import { BaseCustomGeneratorOptions, CustomGeneratorOptions } from "./types/index";

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
