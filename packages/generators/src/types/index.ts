import Generator from "yeoman-generator";
import path from "path";

export type InitOptions = { template: string; force?: boolean };
export type LoaderOptions = { template: string };
export type PluginOptions = { template: string };

export class CustomGenerator<
  T extends Generator.GeneratorOptions = Generator.GeneratorOptions,
> extends Generator<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public cli: any;
  public template: string;
  public dependencies: string[];
  public force: boolean;
  public answers: Record<string, unknown>;
  public generationPath: string;
  public supportedTemplates: string[];

  public constructor(args: string | string[], opts: T) {
    super(args, opts);

    this.cli = opts.cli;
    this.dependencies = [];
    this.answers = {};
    this.supportedTemplates = [];

    const { options } = opts;

    this.template = options.template;
    this.force = options.force;
    this.generationPath = path.resolve(process.cwd(), options.generationPath);
  }
}
